import type { DB } from "@/lib/db/db";
import type { Kysely } from "kysely";

import { RlsService } from "@modules/common";
import { sql } from "kysely";

export async function withOrgContext<T>(
  db: Kysely<DB>,
  organizationId: string,
  fn: (db: Kysely<DB>) => Promise<T>,
) {
  return await db.transaction().execute(async (trx) => {
    await sql`SELECT set_config(${RlsService.contexts.org}, ${organizationId}, FALSE)`.execute(
      trx,
    );
    return await fn(trx);
  });
}
