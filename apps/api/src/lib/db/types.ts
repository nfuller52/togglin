import type { Kysely } from "kysely";
import type { DB } from "./db";

export type ServiceDataSource = Kysely<DB>;
