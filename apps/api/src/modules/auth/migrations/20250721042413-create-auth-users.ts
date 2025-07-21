import type { Kysely } from "kysely";

import { sql } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "auth_users";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addColumn("email", sql`citext`, (col) => col.notNull())
    .addColumn("password_hash", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex(`${TABLE_NAME}_email`)
    .on(TABLE_NAME)
    .column("email")
    .unique()
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex(`${TABLE_NAME}_email`).execute();
  await db.schema.dropTable(TABLE_NAME).execute();
}
