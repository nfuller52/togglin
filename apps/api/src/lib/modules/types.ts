import type { ApplicationEnvironment } from "@/configs/env";
import type { DB } from "@/lib/db/db";
import type { Kysely } from "kysely";
import type { Logger } from "pino";

export interface AppContext {
  app: {
    env: ApplicationEnvironment;
  };
  db: Kysely<DB>;
  logger: Logger;
}
