import type { DB } from "@/lib/db/db";
import type { ControlledTransaction } from "kysely";

import { db as primaryDb } from "@db";

// chat GPT saved me on this lil trick! very nice setup
declare global {
  var db: ControlledTransaction<DB>;
}

let _db: ControlledTransaction<DB>;

beforeEach(async () => {
  _db = await primaryDb.startTransaction().execute();
  globalThis.db = _db;
});

afterEach(async () => {
  await _db.rollback().execute();
});
