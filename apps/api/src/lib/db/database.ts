import type { DB } from "./db";

import { app } from "@app";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: app.env.DATABASE_NAME,
    host: app.env.DATABASE_HOST,
    port: app.env.DATABASE_PORT,
    user: app.env.DATABASE_USER,
    password: app.env.DATABASE_PASSWORD,
    max: app.env.DATABASE_POOL_MAX,
  }),
});

export const db = new Kysely<DB>({ dialect });

/**
 * ! DO NOT USE !
 *
 * This instance is not available in cloud environments
 */
export const migrationDb = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: app.env.DATABASE_NAME,
      host: app.env.DATABASE_HOST,
      port: app.env.DATABASE_PORT,
      user: app.env.DATABASE_MIGRATION_USER,
      password: app.env.DATABASE_MIGRATION_PASSWORD,
    }),
  }),
});
