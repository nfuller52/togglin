import { spawnSync } from "node:child_process";
import path from "node:path";

export const DB_CONTAINER = "togglin_db";
export const STRUCTURE_FILE_PATH = path.join(__dirname, "../structure.sql");

export function isDockerRunning(containerName: string): boolean {
  const result = spawnSync("docker", [
    "ps",
    "--filter",
    `name=${containerName}`,
    "--format",
    "{{.Names}}",
  ]);

  return (
    result.status === 0 &&
    result.stdout.toString().split("\n").includes(containerName)
  );
}
