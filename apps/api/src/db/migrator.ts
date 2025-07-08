import type { MigrationResultSet } from "kysely";
import type { DB } from "./db";

import { promises as fs } from "node:fs";
import * as path from "node:path";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import { Pool } from "pg";
import { config } from "@/configs";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: config.env.DATABASE_NAME,
      host: config.env.DATABASE_HOST,
      port: config.env.DATABASE_PORT,
      user: config.env.DATABASE_MIGRATION_USER,
      password: config.env.DATABASE_MIGRATION_PASSWORD,
    }),
  }),
});

async function runMigrations(direction: "up" | "down") {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: MIGRATIONS_DIR,
    }),
  });

  console.info("Running Migrations...");

  let migrationResult: MigrationResultSet;
  if (direction === "up") {
    migrationResult = await migrator.migrateToLatest();
  } else {
    migrationResult = await migrator.migrateDown();
  }

  const { error, results } = migrationResult;

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.info(`  -> SUCCESS: "${it.migrationName}"`);
    } else {
      console.error(`  -> FAILURE: "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error(`Failed to migrate ${direction}`);
    console.error(error);
    process.exit(1);
  }

  // close the connection
  await db.destroy();
}

const direction = process.argv[2] === "down" ? "down" : "up";
runMigrations(direction);
