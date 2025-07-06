import type { Kysely } from "kysely";

import { createDefaultRls, removeDefaultRls } from "@/db/utils/rls";
import { RlsService } from "@/modules/common";

import "@/db/utils/kysely-extensions";

const TABLE_NAME = "tenants_organizations";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addUUIDPrimaryKey()
    .addTimestamps()
    .addColumn("name", "text", (col) => col.notNull())
    .execute();

  await createDefaultRls(db, TABLE_NAME, "id", "uuid", RlsService.contexts.org);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await removeDefaultRls(db, TABLE_NAME);

  await db.schema.dropTable(TABLE_NAME).execute();
}
