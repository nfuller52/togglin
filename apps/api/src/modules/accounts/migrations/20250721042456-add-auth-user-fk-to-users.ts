import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "accounts_users";
const INDEX_NAME = `${TABLE_NAME}_auth_user_id`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable(TABLE_NAME)
    .addColumn("auth_user_id", "uuid", (col) =>
      col.references("auth_users.id").onDelete("cascade").notNull(),
    )
    .execute();

  await db.schema
    .createIndex(INDEX_NAME)
    .on(TABLE_NAME)
    .column("auth_user_id")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex(INDEX_NAME);
  await db.schema.alterTable(TABLE_NAME).dropColumn("auth_user_id").execute();
}
