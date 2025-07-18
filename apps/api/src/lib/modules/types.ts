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

export type ServiceSuccess<T> = {
  ok: true;
  data: T;
  error: null;
};

export type ServiceFailure<E extends string = string> = {
  ok: false;
  data: null;
  error: E;
};

export type ServiceResult<T, E extends string = string> =
  | ServiceSuccess<T>
  | ServiceFailure<E>;

export type InferServiceResult<
  TFn extends (...args: never[]) => Promise<unknown>,
  E extends string = string,
> = Promise<ServiceResult<Awaited<ReturnType<TFn>>, E>>;
