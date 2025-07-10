import type { MigrationResultSet } from "kysely";

import { promises as fs } from "node:fs";
import * as path from "node:path";
import { FileMigrationProvider, Migrator } from "kysely";
import { migrationDb } from "./database";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function runMigrations(direction: "up" | "down") {
  const migrator = new Migrator({
    db: migrationDb,
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
  await migrationDb.destroy();
}

const direction = process.argv[2] === "down" ? "down" : "up";
runMigrations(direction);
