import type { DB } from "@/lib/db/db";
import type { OrganizationCreateParams } from "@shared/schemas/organizations";
import type { PaginationParams } from "@shared/schemas/pagination";
import type { Kysely } from "kysely";

import { TENANTS_ORGANIZATIONS_TABLE } from "./constants";

async function listOrganizations(
  db: Kysely<DB>,
  paginationParams: PaginationParams = { page: 1, limit: 10 },
) {
  const offset = (paginationParams.page - 1) * paginationParams.limit;

  return await db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .selectAll(TENANTS_ORGANIZATIONS_TABLE)
    .limit(paginationParams.limit)
    .offset(offset)
    .execute();
}

async function countOrganizations(db: Kysely<DB>) {
  return await db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .select(({ fn }) => [fn.countAll().as("count")])
    .executeTakeFirst();
}

async function getOrganization(db: Kysely<DB>, id: string) {
  return await db
    .selectFrom(TENANTS_ORGANIZATIONS_TABLE)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

async function createOrganization(
  db: Kysely<DB>,
  orgParams: OrganizationCreateParams,
) {
  return db
    .insertInto(TENANTS_ORGANIZATIONS_TABLE)
    .values(orgParams)
    .returningAll()
    .executeTakeFirst();
}

export const TenantsQueries = {
  countOrganizations,
  createOrganization,
  getOrganization,
  listOrganizations,
};
