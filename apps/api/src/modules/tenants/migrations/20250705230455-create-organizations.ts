import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_organizations";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addColumn("name", "text", (col) => col.notNull())
    .execute();

  // Enable RLS except for inserts. Inserts are allowed for registration
  // await enableRls(db, TABLE_NAME);
  // await Promise.all(
  //   rlsPolicies.map((rlsPolicy) => rlsPolicyBuilder(rlsPolicy).execute(db)),
  // );
}

export async function down(db: Kysely<unknown>): Promise<void> {
  // await removeDefaultRls(db, TABLE_NAME);

  await db.schema.dropTable(TABLE_NAME).execute();
}

// const commonSettings: Partial<RlsPolicyBuilder> = {
//   checkFieldName: "id",
//   checkFieldDataType: "uuid",
//   sessionKey: RlsService.contexts.org,
// };

// const rlsPolicies: RlsPolicyBuilder[] = [
//   // Select an org with the correct context
//   {
//     mode: "SELECT",
//     strategy: "USING",
//     allowAccess: true,
//     tableName: TABLE_NAME,
//     ...commonSettings,
//   },
//   // Find an or to mutate with the correct context
//   {
//     mode: "UPDATE",
//     strategy: "USING",
//     allowAccess: true,
//     tableName: TABLE_NAME,
//     ...commonSettings,
//   },
//   // Mutate an org with the correct context
//   {
//     mode: "UPDATE",
//     strategy: "WITH CHECK",
//     allowAccess: true,
//     tableName: TABLE_NAME,
//     ...commonSettings,
//   },
//   // Silently fail on delete
//   {
//     mode: "DELETE",
//     strategy: "USING",
//     allowAccess: false,
//     tableName: TABLE_NAME,
//   },
//   // Allow any user to create an organization
//   {
//     mode: "INSERT",
//     strategy: "WITH CHECK",
//     allowAccess: true,
//     tableName: TABLE_NAME,
//   },
// ];
