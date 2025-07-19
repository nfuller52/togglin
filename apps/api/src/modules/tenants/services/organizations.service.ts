import type { ServiceDataSource } from "@/lib/db/types";
import type { OrganizationCreateParams } from "@shared/schemas/organizations";
import type { PaginationParams } from "@shared/schemas/pagination";

import { Service } from "@/lib/modules/service";
import { TenantsQueries } from "../tenants.queries";

async function list(db: ServiceDataSource, paginationParams: PaginationParams) {
  const [data, countResult] = await Promise.all([
    TenantsQueries.listOrganizations(db, paginationParams),
    TenantsQueries.countOrganizations(db),
  ]);

  const total = countResult?.count ?? 0;

  return Service.success({ data, total: parseInt(total.toString()) });
}

async function get(db: ServiceDataSource, id: string) {
  const org = await TenantsQueries.getOrganization(db, id);
  if (!org) return Service.error("NOT_FOUND");

  return Service.success(org);
}

async function create(
  db: ServiceDataSource,
  orgParams: OrganizationCreateParams,
) {
  const org = await TenantsQueries.createOrganization(db, orgParams);
  if (!org) return Service.error("CREATE_FAILED");

  return Service.success(org);
}

export const OrganizationService = {
  list,
  get,
  create,
};
