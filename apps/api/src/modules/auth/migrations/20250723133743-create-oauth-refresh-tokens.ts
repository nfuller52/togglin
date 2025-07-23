import type { Kysely } from "kysely";

import { sql } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "auth_oauth_refresh_tokens";
const AUTH_REFRESH_TOKEN_STATUS_ENUM = "auth_refresh_token_status";
const AUTH_USER_INDEX = `${TABLE_NAME}_auth_user_id`;

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType(AUTH_REFRESH_TOKEN_STATUS_ENUM)
    .asEnum(["rotation", "logout", "compromise"])
    .execute();

  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addColumn("expires_at", "timestamptz", (col) =>
      col.defaultTo(sql<string>`now()`).notNull(),
    )
    .addColumn("short_id", "varchar(21)", (col) => col.unique().notNull())
    .addReference("auth_users", {
      columnName: "auth_user_id",
      onDelete: "cascade",
    })
    .addColumn("revoked_at", "timestamptz")
    .addColumn("revoked_reason", sql`auth_refresh_token_status`)
    .addReference(TABLE_NAME, {
      columnName: "replaced_by_token_id",
      onDelete: "cascade",
      nullable: true,
    })
    .execute();

  await db.schema
    .createIndex(AUTH_USER_INDEX)
    .on(TABLE_NAME)
    .column("auth_user_id")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex(AUTH_USER_INDEX);
  await db.schema.dropTable(TABLE_NAME).execute();
  await db.schema.dropType(AUTH_REFRESH_TOKEN_STATUS_ENUM).execute();
}
