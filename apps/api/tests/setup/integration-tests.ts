import type { DB } from "@/lib/db/db";
import type { Express } from "express";
import type { ControlledTransaction, Kysely } from "kysely";

import { db } from "@db";
import { createApp } from "@/app";
import { truncateAll } from "../utils/reset-db";

declare global {
  var app: Express;
  var db: ControlledTransaction<DB> | Kysely<DB>;
}

beforeAll(async () => {
  globalThis.app = await createApp();
});

beforeEach(async () => {
  globalThis.db = db;
  await truncateAll();
});

afterEach(async () => {
  await truncateAll();
});
