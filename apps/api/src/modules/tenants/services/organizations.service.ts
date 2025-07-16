import type { ServiceDataSource } from "@/lib/db/types";
import type { OrganizationCreateParams } from "@shared/schemas/organizations";
import type { PaginationParams } from "@shared/schemas/pagination";

import { TenantsQueries } from "../tenants.queries";

async function list(db: ServiceDataSource, paginationParams: PaginationParams) {
  const [data, countResult] = await Promise.all([
    TenantsQueries.listOrganizations(db, paginationParams),
    TenantsQueries.countOrganizations(db),
  ]);

  const total = countResult?.count ?? 0;

  return { data, total: parseInt(total.toString()) };
}

async function get(db: ServiceDataSource, id: string) {
  const data = TenantsQueries.getOrganization(db, id);
  return { data };
}

async function create(
  db: ServiceDataSource,
  orgParams: OrganizationCreateParams,
) {
  const data = TenantsQueries.createOrganization(db, orgParams);
  return data;
}

export const OrganizationService = {
  list,
  get,
  create,
};
