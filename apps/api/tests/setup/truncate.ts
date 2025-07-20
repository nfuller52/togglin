import type { DB } from "@/lib/db/db";
import type { ControlledTransaction, Kysely } from "kysely";

import { db as primaryDb } from "@db";
import { truncateAll } from "../utils/reset-db";

declare global {
  var db: ControlledTransaction<DB> | Kysely<DB>;
}

beforeEach(async () => {
  globalThis.db = primaryDb;
  await truncateAll();
});

afterEach(async () => {
  await truncateAll();
});
