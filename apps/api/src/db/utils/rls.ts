import type { Kysely } from "kysely";

import { sql } from "kysely";

/**
 * Set the default RLS policies for a given table.
 *   - policy name: `rls_table_name_read_select` (USING SELECT)
 *   - policy name: `rls_table_name_read_update` (USING UPDATE)
 *   - policy name: `rls_table_name_mutate_insert` (WITH CHECK INSERT)
 *   - policy name: `rls_table_name_mutate_update` (WITH CHECK UPDATE)
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @param checkFieldName - The column to compare the session to
 * @param checkFieldDataType - Postgres data type (`uuid`, `int`, etc...)
 * @param sessionKey - Postgres config key (`"app.current_organization"`)
 * @returns
 */
export async function createDefaultRls(
  db: Kysely<unknown>,
  tableName: string,
  checkFieldName: string,
  checkFieldDataType: string,
  sessionKey: string,
) {
  await Promise.all([
    enableRls(db, tableName),
    enableRlsSelectPolicy(
      db,
      tableName,
      `rls_${tableName}`,
      checkFieldName,
      checkFieldDataType,
      sessionKey,
    ),
    enableRlsMutationPolicy(
      db,
      tableName,
      `rls_${tableName}`,
      checkFieldName,
      checkFieldDataType,
      sessionKey,
    ),
  ]);
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
export async function enableRls(db: Kysely<unknown>, tableName: string) {
  await rlsPolicy(db, tableName, "ENABLE");
}

/**
 * Disable RLS for a given table
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @returns Promise that resolves when RLS is disabled
 */
export async function disableRls(db: Kysely<unknown>, tableName: string) {
  await rlsPolicy(db, tableName, "DISABLE");
}

/**
 * Create an RLS policy which controls whether records are readable.
 *
 * Uses the `USING` RLS keyword.
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @param policyName - Base name for the policy (a suffix is added per mode)
 * @param checkFieldName - The column to compare the session to
 * @param checkFieldDataType - Postgres data type (`uuid`, `int`, etc...)
 * @param sessionKey - Postgres config key (`"app.current_organization"`)
 * @param modes - Array of modes to apply `["select", "update", "delete"`]
 * @returns Promise that resolves when the policies are created
 *
 * | Action   | Purpose
 * |----------|---------------------------------|
 * | `SELECT` | Rows are selectable             |
 * | `UPDATE` | Row is selectable to be updated |
 * | `DELETE` | Row is deletable                |
 */
export async function enableRlsSelectPolicy(
  db: Kysely<unknown>,
  tableName: string,
  policyName: string,
  checkFieldName: string,
  checkFieldDataType: string,
  sessionKey: string,
  modes: ("select" | "update" | "delete")[] = ["select", "update"],
) {
  const expression = policyExpression(
    "USING",
    checkFieldName,
    sessionKey,
    checkFieldDataType,
  );

  await Promise.all(
    modes.map((mode) =>
      sql<string>`CREATE POLICY ${sql.raw(policyName)}_read_${sql.raw(mode)}
                  ON ${sql.ref(tableName)}
                  FOR ${sql.raw(mode.toUpperCase())} ${expression};`.execute(
        db,
      ),
    ),
  );
}

/**
 * Create an RLS policy which controls whether records may be mutated.
 *
 * INSERT/UPDATE
 *
 * Uses the `WITH CHECK` RLS keyword.
 *
 * @param db - A Kysely db instance
 * @param tableName - Name of the table to apply RLS
 * @param policyName - Base name for the policy (a suffix is added per mode)
 * @param checkFieldName - The column to compare the session to
 * @param checkFieldDataType - Postgres data type (`uuid`, `int`, etc...)
 * @param sessionKey - Postgres config key (`"app.current_organization"`)
 * @param modes - Array of modes to apply `["insert", "update"`]
 * @returns Promise that resolves when the policies are created
 *
 * | Action   | Purpose
 * |----------|------------------------------------------------------|
 * | `INSERT` | Checks the new row after values are supplied         |
 * | `UPDATE` | Checks the final value after SETs, but before commit |
 */
export async function enableRlsMutationPolicy(
  db: Kysely<unknown>,
  tableName: string,
  policyName: string,
  checkFieldName: string,
  checkFieldDataType: string,
  sessionKey: string,
  modes: ("insert" | "update")[] = ["insert", "update"],
) {
  const expression = policyExpression(
    "WITH CHECK",
    checkFieldName,
    sessionKey,
    checkFieldDataType,
  );

  await Promise.all(
    modes.map((mode) =>
      sql<string>`CREATE POLICY ${sql.raw(policyName)}_mutate_${sql.raw(mode)}
                  ON ${sql.ref(tableName)}
                  FOR ${sql.raw(mode.toUpperCase())} ${expression};`.execute(
        db,
      ),
    ),
  );
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
  await sql<string>`DROP POLICY IF EXISTS ${sql.raw(policyName)}
                    ON ${sql.ref(tableName)};`.execute(db);
}

async function rlsPolicy(
  db: Kysely<unknown>,
  tableName: string,
  toggle: "ENABLE" | "DISABLE",
) {
  await sql<string>`ALTER TABLE ${sql.ref(tableName)}
                    ${sql.raw(toggle)} ROW LEVEL SECURITY`.execute(db);
}

function policyExpression(
  mode: "USING" | "WITH CHECK",
  fieldName: string,
  key: string,
  fieldDataType: string,
) {
  return sql`${sql.raw(mode)} (${sql.ref(fieldName)} = current_setting(${sql.lit(
    key,
  )})::${sql.raw(fieldDataType)})`;
}
