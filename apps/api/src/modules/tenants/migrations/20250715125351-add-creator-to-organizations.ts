import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_organizations";
const INDEX_NAME = `${TABLE_NAME}_created_by_id`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable(TABLE_NAME)
    .addColumn("created_by_id", "uuid", (col) =>
      col.references("accounts_users.id").onDelete("restrict").notNull(),
    )
    .execute();

  await db.schema
    .createIndex(INDEX_NAME)
    .on(TABLE_NAME)
    .column("created_by_id")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex(INDEX_NAME).execute();
  await db.schema.alterTable(TABLE_NAME).dropColumn("created_by_id").execute();
}
