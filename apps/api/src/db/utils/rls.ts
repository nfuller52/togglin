import type { Kysely } from "kysely";

import { sql } from "kysely";

export type RlsPolicyBuilder = {
  tableName: string;
  mode: "SELECT" | "UPDATE" | "DELETE" | "INSERT";
  strategy: "USING" | "WITH CHECK";
  allowAccess?: boolean;
  policyName?: string;
  checkFieldName?: string;
  checkFieldDataType?: string;
  sessionKey?: string;
};

/**
 * Creates a standard set of RLS (Row-Level Security) policies for a given table.
 *
 * This function applies a default pattern of access control:
 * - SELECT and UPDATE (read) access allowed for matching session context.
 * - DELETE access denied by default.
 * - INSERT and UPDATE (write) access allowed with `WITH CHECK` based on the session context.
 *
 * @param db - The Kysely database instance.
 * @param tableName - The name of the target table to apply policies to.
 * @param checkFieldName - The column to compare against the session key (e.g., `organization_id`).
 * @param checkFieldDataType - The SQL type of the check field (e.g., `uuid`, `text`).
 * @param sessionKey - The session key name used with `current_setting()` (e.g., `'app.current_organization'`).
 *
 * @remarks
 * This function generates 5 policies:
 * - `USING SELECT`: allow access if `checkFieldName` matches session
 * - `USING UPDATE`: allow access if `checkFieldName` matches session
 * - `USING DELETE`: deny all access (default `false`)
 * - `WITH CHECK INSERT`: allow only if inserted `checkFieldName` matches session
 * - `WITH CHECK UPDATE`: allow only if updated `checkFieldName` matches session
 *
 * These policies are generated via `rlsPolicyBuilder()` and executed using `Promise.all`.
 *
 * @example
 * await createDefaultRls(
 *   db,
 *   'tenants_organizations',
 *   'organization_id',
 *   'uuid',
 *   'app.current_organization'
 * );
 */
export async function createDefaultRls(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: Kysely<any>,
  tableName: string,
  checkFieldName: string,
  checkFieldDataType: string,
  sessionKey: string,
) {
  const configs: {
    mode: "SELECT" | "UPDATE" | "DELETE" | "INSERT";
    strategy: "USING" | "WITH CHECK";
    allowAccess: boolean;
  }[] = [
    { mode: "SELECT", strategy: "USING", allowAccess: true },
    { mode: "UPDATE", strategy: "USING", allowAccess: true },
    { mode: "DELETE", strategy: "USING", allowAccess: false },
    { mode: "INSERT", strategy: "WITH CHECK", allowAccess: true },
    { mode: "UPDATE", strategy: "WITH CHECK", allowAccess: true },
  ];

  await Promise.all(
    configs.map((config) => {
      const baseConfig = { ...config, tableName };

      const fullConfig =
        config.mode === "DELETE"
          ? baseConfig
          : {
              ...baseConfig,
              checkFieldName,
              checkFieldDataType,
              sessionKey,
            };

      return rlsPolicyBuilder(fullConfig).execute(db);
    }),
  );
}

/**
 * Builds a PostgreSQL RLS (Row-Level Security) `CREATE POLICY` statement using Kysely's SQL builder.
 *
 * This utility generates a policy to control access to rows in a table based on a matching session setting
 * (e.g., `current_setting('app.current_organization')`) and an optional boolean access flag.
 *
 * @param tableName - The name of the table the policy will be applied to.
 * @param mode - The type of action the policy applies to (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
 * @param strategy - Whether the policy is a `USING` (read filter) or `WITH CHECK` (write filter) policy.
 * @param allowAccess - Whether to allow access for the matched rows. Defaults to `false`.
 * @param policyName - Optional explicit name for the policy. If omitted, a default name is generated.
 * @param checkFieldName - Optional column name to compare against the session setting.
 * @param checkFieldDataType - The SQL data type of the `checkFieldName` (e.g., `uuid`, `text`).
 * @param sessionKey - The Postgres `current_setting()` key used to identify the session scope (e.g., `'app.current_organization'`).
 *
 * @returns A `sql` object representing a compiled RLS `CREATE POLICY` SQL statement.
 *
 * @example
 * rlsPolicyBuilder(
 *   tableName: 'tenants_organizations',
 *   mode: 'SELECT',
 *   strategy: 'USING',
 *   allowAccess: true,
 *   checkFieldName: 'organization_id',
 *   checkFieldDataType: 'uuid',
 *   sessionKey: 'app.current_organization'
 * );
 */
export function rlsPolicyBuilder({
  tableName,
  mode,
  strategy,
  allowAccess = false,
  policyName,
  checkFieldName,
  checkFieldDataType,
  sessionKey,
}: RlsPolicyBuilder) {
  const fullPolicyName =
    policyName ??
    `rls_${tableName}_${strategy === "USING" ? "read" : "mutate"}_${mode.toLowerCase()}`;

  let clause: string;

  if (checkFieldName && checkFieldDataType && sessionKey) {
    clause = `(${checkFieldName} = current_setting('${sessionKey}', ${allowAccess ? "true" : "false"})::${checkFieldDataType})`;
  } else {
    clause = allowAccess ? "(true)" : "(false)";
  }

  return sql<string>`CREATE POLICY ${sql.raw(fullPolicyName)} ON ${sql.ref(tableName)} FOR ${sql.raw(mode)} ${sql.raw(strategy)} ${sql.raw(clause)};`;
}

/**
 * Remove the default RLS policies for a given table.
 *   - policy name: `rls_table_name_read_select` (USING SELECT)
 *   - policy name: `rls_table_name_read_update` (USING UPDATE)
 *   - policy name: `rls_table_name_mutate_insert` (WITH CHECK INSERT)
 *   - policy name: `rls_table_name_mutate_update` (WITH CHECK UPDATE)
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to remove RLS
 */
export async function removeDefaultRls(db: Kysely<unknown>, tableName: string) {
  await Promise.all([
    disableRlsPolicy(db, tableName, `rls_${tableName}_read_select`),
    disableRlsPolicy(db, tableName, `rls_${tableName}_read_update`),
    disableRlsPolicy(db, tableName, `rls_${tableName}_read_delete`),
    disableRlsPolicy(db, tableName, `rls_${tableName}_mutate_insert`),
    disableRlsPolicy(db, tableName, `rls_${tableName}_mutate_update`),
    disableRls(db, tableName),
  ]);
}

/**
 * Enable RLS for a given table
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @returns Promise that resolves when RLS is enabled
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function enableRls(db: Kysely<any>, tableName: string) {
  await rlsPolicy(db, tableName, "ENABLE");
}

/**
 * Disable RLS for a given table
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @returns Promise that resolves when RLS is disabled
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function disableRls(db: Kysely<any>, tableName: string) {
  await rlsPolicy(db, tableName, "DISABLE");
}

/**
 * Remove an existing RLS policy. You'll need to add the mode suffix manually
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @param policyName - Base name for the policy; include the mode suffix!
 */
export async function disableRlsPolicy(
  db: Kysely<unknown>,
  tableName: string,
  policyName: string,
) {
  await sql<string>`DROP POLICY IF EXISTS ${sql.raw(policyName)} ON ${sql.ref(tableName)};`.execute(
    db,
  );
}

async function rlsPolicy(
  db: Kysely<unknown>,
  tableName: string,
  toggle: "ENABLE" | "DISABLE",
) {
  await sql<string>`ALTER TABLE ${sql.ref(tableName)} ${sql.raw(toggle)} ROW LEVEL SECURITY`.execute(
    db,
  );
}
