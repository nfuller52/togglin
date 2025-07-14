import type { ServiceDataSource } from "@/lib/db/types";
import type { PaginationParams } from "@lib/modules/pagination/schema";

import { TenantsData } from "../tenants.queries";

async function list(db: ServiceDataSource, paginationParams: PaginationParams) {
  const [data, countResult] = await Promise.all([
    TenantsData.listOrganizations(db, paginationParams),
    TenantsData.countOrganizations(db),
  ]);

  const total = countResult?.count ?? 0;

  return { data, total: parseInt(total.toString()) };
}

async function get(db: ServiceDataSource, id: string) {
  const data = TenantsData.getOrganization(db, id);
  return { data };
}

export const OrganizationService = {
  list,
  get,
};
