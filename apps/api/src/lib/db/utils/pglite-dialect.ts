import type { PGliteOptions } from "@electric-sql/pglite";
import type { Dialect } from "kysely";

import { PGlite } from "@electric-sql/pglite";
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";
import { PGliteDriver } from "./pglite-driver";

// https://github.com/dnlsandiego/kysely-pglite/blob/main/src/kysely-pglite.ts
export class PGliteDialect {
  client: PGlite;

  constructor(client: PGlite) {
    this.client = client;
  }

  static async create(options?: PGliteOptions): Promise<PGliteDialect> {
    const client = await PGlite.create(options);
    return new PGliteDialect(client);
  }

  dialect: Dialect = {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new PGliteDriver(this.client),
    createIntrospector: (db: Kysely<unknown>) => new PostgresIntrospector(db),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  };
}
