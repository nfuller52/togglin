import type { Kysely } from "kysely";

import { sql } from "kysely";

import "@/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_programs";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addReference("tenants_organizations", {
      columnName: "organization_id",
      onDelete: "cascade",
    })
    .addColumn("name", sql<string>`citext`, (col) => col.notNull())
    .addUniqueConstraint("tenants_projects_uniq_name_org_id", [
      "name",
      "organization_id",
    ])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).execute();
}
