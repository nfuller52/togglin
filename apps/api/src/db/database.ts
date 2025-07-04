import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { config } from "@/configs";
import type { DB } from "./db";

const dialect = new PostgresDialect({
	pool: new Pool({
		database: config.env.DATABASE_NAME,
		host: config.env.DATABASE_HOST,
		port: config.env.DATABASE_PORT,
		user: config.env.DATABASE_USER,
		password: config.env.DATABASE_PASSWORD,
		max: config.env.DATABASE_POOL_MAX,
	}),
});

export const db = new Kysely<DB>({ dialect });
