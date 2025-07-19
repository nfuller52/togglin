import type { DB } from "@/lib/db/db";
import type { PaginationParams } from "@shared/schemas/pagination";
import type { Kysely } from "kysely";

import { TENANTS_ORGANIZATIONS_TABLE } from "../constants";

async function list(
  db: Kysely<DB>,
  paginationParams: PaginationParams = { page: 1, limit: 10 },
) {
  const offset = (paginationParams.page - 1) * paginationParams.limit;

  return db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .selectAll(TENANTS_ORGANIZATIONS_TABLE)
    .limit(paginationParams.limit)
    .offset(offset)
    .execute();
}

async function count(db: Kysely<DB>) {
  return db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .select(({ fn }) => [fn.countAll<number>().as("count")])
    .executeTakeFirst();
}

async function get(db: Kysely<DB>, id: string) {
  return db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export const OrganizationQueries = {
  list,
  count,
  get,
};
