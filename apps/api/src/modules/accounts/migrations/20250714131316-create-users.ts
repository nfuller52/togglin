import type { Kysely } from "kysely";

import { sql } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "accounts_users";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", sql`citext`, (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("accounts_users_email")
    .on(TABLE_NAME)
    .column("email")
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex("accounts_users_email").execute();
  await db.schema.dropTable(TABLE_NAME).execute();
}
