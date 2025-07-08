import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { config } from "dotenv";
import { DB_CONTAINER, isDockerRunning, STRUCTURE_FILE_PATH } from "./db-utils";

config({ path: ".env.local", override: true, quiet: true });

const DB_URL = process.env.DATABASE_URL;
const DB_USER = process.env.DATABASE_MIGRATION_USER;

const pgDumpArgs: string[] = [
  "--schema-only",
  "--no-owner",
  "--no-privileges",
  "--dbname",
  `${DB_URL}`,
  "--username",
  `${DB_USER}`,
];

if (isDockerRunning(DB_CONTAINER)) {
  dumpStructureFile("docker", ["exec", DB_CONTAINER, "pg_dump", ...pgDumpArgs]);
} else {
  dumpStructureFile("pg_dump", pgDumpArgs);
}

function dumpStructureFile(rootBinary: "docker" | "pg_dump", args: string[]) {
  const outputStream = createWriteStream(STRUCTURE_FILE_PATH);

  // https://nodejs.org/api/child_process.html#child_processspawncommand-args-options
  const supProcess = spawn(rootBinary, args, {
    stdio: ["ignore", "pipe", "inherit"],
  });

  // write to the file
  supProcess.stdout.pipe(outputStream);

  // we need to trap the return value of the sub process
  supProcess.on("close", (response) => {
    if (response === 0) {
      console.log("\nSUCCESS: structure.sql dumped successfully");
    } else {
      console.error("\nERROR: failed to generate structure.sql file");
      process.exit(response ?? 1);
    }
  });
}
