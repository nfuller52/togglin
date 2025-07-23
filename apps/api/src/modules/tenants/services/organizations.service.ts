import type { ServiceDataSource } from "@/lib/db/types";
import type { OrganizationCreateParams } from "@shared/schemas/organizations";
import type { PaginationParams } from "@shared/schemas/pagination";

import { UsersService } from "@modules/accounts";
import { Service } from "@/lib/modules/service";
import { tryCatch } from "@/utils/try-catch";
import { OrganizationQueries } from "../queries/organizations.queries";

async function list(db: ServiceDataSource, paginationParams: PaginationParams) {
  const { data, error } = await tryCatch(
    Promise.all([
      OrganizationQueries.list(db, paginationParams),
      OrganizationQueries.countAll(db),
    ]),
  );

  if (error || !data) return Service.error("DB_ERROR");

  const [queryResult, countResult] = data;

  return Service.success({
    data: queryResult,
    total: (countResult?.count as number) ?? 0,
  });
}

async function get(db: ServiceDataSource, id: string) {
  const { data: org, error } = await tryCatch(OrganizationQueries.get(db, id));
  if (error || !org) return Service.error("NOT_FOUND");

  return Service.success(org);
}

async function create(
  db: ServiceDataSource,
  orgParams: OrganizationCreateParams,
) {
  const result = await UsersService.get(db, orgParams.createdById);
  if (!result.ok || result.error === "USER_NOT_FOUND") {
    return Service.error("USER_NOT_FOUND");
  }

  const { data: org, error } = await tryCatch(
    OrganizationQueries.insert(db, orgParams),
  );

  if (error || !org) return Service.error("CREATE_FAILED");

  return Service.success(org);
}

export const OrganizationService = {
  list,
  get,
  create,
};
