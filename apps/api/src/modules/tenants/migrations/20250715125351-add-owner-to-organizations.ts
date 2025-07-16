import type { Kysely } from "kysely";

import "@/lib/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_organizations";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable(TABLE_NAME)
    .addColumn("owner_id", "uuid", (col) =>
      col.references("accounts_users.id").onDelete("restrict").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable(TABLE_NAME).dropColumn("owner_id").execute();
}
