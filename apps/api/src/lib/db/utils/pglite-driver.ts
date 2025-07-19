import type {
  DatabaseConnection,
  Driver,
  QueryResult,
  TransactionSettings,
} from "kysely";

import { PGlite } from "@electric-sql/pglite";
import { CompiledQuery } from "kysely";

// https://github.com/dnlsandiego/kysely-pglite/blob/main/src/pglite-driver.ts
export class PGliteDriver implements Driver {
  #client: PGlite;

  constructor(client: PGlite) {
    this.#client = client;
  }

  async init(): Promise<void> {
    // No-op
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async releaseConnection(_connection: DatabaseConnection): Promise<void> {
    // No-op
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new PGliteConnection(this.#client);
  }

  async beginTransaction(
    connection: DatabaseConnection,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _settings: TransactionSettings,
  ): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("BEGIN"));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("COMMIT"));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("ROLLBACK"));
  }

  async destroy(): Promise<void> {
    await this.#client.close();
  }
}

class PGliteConnection implements DatabaseConnection {
  #client: PGlite;

  constructor(client: PGlite) {
    this.#client = client;
  }

  async executeQuery<T>(compiledQuery: CompiledQuery): Promise<QueryResult<T>> {
    return this.#client.query<T>(compiledQuery.sql, [
      ...compiledQuery.parameters,
    ]);
  }

  async *streamQuery(): AsyncGenerator<never, void, unknown> {
    throw new Error("PGlite does not support streaming.");
  }
}
