import type { LogEvent } from "kysely";
import type { DB } from "./db";

import { app } from "@app";
import { logger } from "@logger";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pgPool = new Pool({
  database: app.env.DATABASE_NAME,
  host: app.env.DATABASE_HOST,
  port: app.env.DATABASE_PORT,
  user: app.env.DATABASE_USER,
  password: app.env.DATABASE_PASSWORD,
  max: app.env.DATABASE_POOL_MAX,
});

const dialect = new PostgresDialect({
  pool: {
    connect: async () => {
      const client = await pgPool.connect();
      return client;
    },
    end: async () => pgPool.end(),
  },
});

export const db = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
  log(event) {
    function formatSqlSingleLine(event: LogEvent): string {
      logger.debug(event.query.parameters.join(", "));
      const parameters =
        event.query.parameters.length > 0
          ? ` (${event.query.parameters.join(", ")})`
          : "";

      return `[sql] (${Math.round(event.queryDurationMillis) / 100}ms) ${removeNewlines(event.query.sql)}${parameters}`;
    }

    function removeNewlines(sql: string): string {
      return sql.replace(/\s+g/, " ").trim();
    }

    const queryOptions = {
      durationMs: event.queryDurationMillis,
      sql: event.query.sql,
      params: event.query.parameters,
    };

    if (event.level === "error") {
      logger.error(formatSqlSingleLine(event), {
        ...queryOptions,
        error: event.error,
      });
    } else if (event.queryDurationMillis > 1000) {
      logger.warn(formatSqlSingleLine(event), queryOptions);
    } else {
      logger.debug(formatSqlSingleLine(event), queryOptions);
    }
  },
});

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
