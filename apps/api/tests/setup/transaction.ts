import type { DB } from "@/db/db";
import type { ControlledTransaction } from "kysely";

import { db } from "@db";

let trx: ControlledTransaction<DB, []>;

beforeEach(async () => {
  trx = await db.startTransaction().execute();
});

afterEach(async () => {
  await trx.rollback().execute();
});
