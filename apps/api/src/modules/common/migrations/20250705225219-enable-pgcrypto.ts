import type { Kysely } from "kysely";

import { sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql<string>`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`.execute(db);
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql<string>`DROP EXTENSION IF EXISTS "pgcrypto";`.execute(db);
}
