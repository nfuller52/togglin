import { spawn } from "node:child_process";
import { config } from "dotenv";
import { DB_CONTAINER, isDockerRunning, STRUCTURE_FILE_PATH } from "./db-utils";

config({ path: ".env.test", override: true, quiet: true });

const DB_USER = process.env.DATABASE_MIGRATION_USER;
const DB_HOST = process.env.DATABASE_HOST;
const DB_PORT = process.env.DATABASE_PORT;
const DB_NAME = process.env.DATABASE_NAME;
const DB_USER_PASS = process.env.DATABASE_MIGRATION_PASSWORD;
const DB_APP_USER = process.env.DATABASE_USER;
const DB_APP_USER_PASS = process.env.DATABASE_PASSWORD;

const dockerArgs: string[] = [
  "exec",
  "-e",
  `PGPASSWORD=${DB_USER_PASS}`,
  DB_CONTAINER,
  "psql",
];

const psqlConnection: string[] = [
  "--username",
  DB_USER ?? "",
  "--host",
  DB_HOST ?? "",
  "--port",
  DB_PORT ?? "5432",
  "--dbname",
  "postgres",
  "--quiet",
];

const COMMAND_ARGS: {
  DROP: string[];
  CREATE: string[];
  LOAD_STRUCTURE: string[];
  CREATE_USER: string[];
  GRANT_USER: string[];
} = {
  DROP: [...psqlConnection, "--command", `DROP DATABASE IF EXISTS ${DB_NAME};`],
  CREATE: [...psqlConnection, "--command", `CREATE DATABASE ${DB_NAME};`],
  // ! CONNECTING TO postgres AND SHOULD CONNECT TO togglin_test
  LOAD_STRUCTURE: [...psqlConnection, "-f"],
  CREATE_USER: [
    ...psqlConnection,
    "--command",
    `DO \$\$ BEGIN
     CREATE ROLE ${DB_APP_USER} LOGIN PASSWORD '${DB_APP_USER_PASS}';
     EXCEPTION WHEN duplicate_object THEN -- do nothing
     END \$\$;`,
  ],
  // ! CONNECTING TO postgres AND SHOULD CONNECT TO togglin_test
  GRANT_USER: [
    ...psqlConnection,
    "--command",
    `GRANT CONNECT ON DATABASE ${DB_NAME} TO ${DB_APP_USER};
     GRANT USAGE ON SCHEMA public TO ${DB_APP_USER};
     GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO ${DB_APP_USER};
     GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO ${DB_APP_USER};
     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO ${DB_APP_USER};
     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO ${DB_APP_USER};`,
  ],
};

async function main() {
  if (isDockerRunning(DB_CONTAINER)) {
    await spawnSubProcess("DROP DB", "docker", [
      ...dockerArgs,
      ...COMMAND_ARGS["DROP"],
    ]);
    await spawnSubProcess("CREATE DB", "docker", [
      ...dockerArgs,
      ...COMMAND_ARGS["CREATE"],
    ]);
    await spawnSubProcess("COPY STRUCTURE", "docker", [
      "cp",
      STRUCTURE_FILE_PATH,
      `${DB_CONTAINER}:/tmp/structure.sql`,
    ]);
    await spawnSubProcess("LOAD STRUCTURE", "docker", [
      ...dockerArgs,
      ...COMMAND_ARGS["LOAD_STRUCTURE"],
      "/tmp/structure.sql",
    ]);
    await spawnSubProcess("CREATE USER", "docker", [
      ...dockerArgs,
      ...COMMAND_ARGS["CREATE_USER"],
    ]);
    await spawnSubProcess("GRANT USER", "docker", [
      ...dockerArgs,
      ...COMMAND_ARGS["GRANT_USER"],
    ]);
  } else {
    await spawnSubProcess("DROP DB", "psql", COMMAND_ARGS["DROP"]);
    await spawnSubProcess("CREATE DB", "psql", COMMAND_ARGS["CREATE"]);
    await spawnSubProcess("CREATE USER", "psql", COMMAND_ARGS["CREATE_USER"]);
    await spawnSubProcess("CREATE USER", "psql", COMMAND_ARGS["GRANT_USER"]);
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

function spawnSubProcess(
  procName: string,
  rootBinary: "docker" | "psql",
  args: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const supProcess = spawn(rootBinary, args, {
      stdio: ["ignore", "pipe", "inherit"],
    });

    supProcess.on("close", (responseCode) => {
      if (responseCode === 0) {
        resolve();
      } else {
        console.error(`\nERROR: failed to run ${procName} on ${rootBinary}`);
        reject(new Error(`${procName} exited with code ${responseCode}`));
      }
    });
  });
}
