import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "accounts_users";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable(TABLE_NAME)
    .addColumn("auth_user_id", "uuid", (col) =>
      col.references("auth_users.id").onDelete("cascade").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable(TABLE_NAME).dropColumn("auth_user_id").execute();
}
