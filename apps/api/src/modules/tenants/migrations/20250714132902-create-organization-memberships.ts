import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_organization_memberships";
const INDEX_NAME = `${TABLE_NAME}_uniq_membership`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addReference("accounts_users", {
      columnName: "user_id",
      onDelete: "cascade",
      nullable: false,
    })
    .addReference("tenants_organizations", {
      columnName: "organization_id",
      onDelete: "restrict",
      nullable: false,
    })
    .execute();

  await db.schema
    .createIndex(INDEX_NAME)
    .on(TABLE_NAME)
    .columns(["user_id", "organization_id"])
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex(INDEX_NAME).execute();
  await db.schema.dropTable(TABLE_NAME).execute();
}
