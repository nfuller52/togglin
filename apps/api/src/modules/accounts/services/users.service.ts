import type { ServiceDataSource } from "@/lib/db/types";
import type { UserCreateParams } from "@shared/schemas/users";

import { Service } from "@/lib/modules/service";
import { UsersQueries } from "../queries/users.queries";

async function create(db: ServiceDataSource, orgParams: UserCreateParams) {
  const userExists = await UsersQueries.getByEmail(db, orgParams.email);
  if (userExists) return Service.error("EMAIL_TAKEN");

  const user = await UsersQueries.createUser(db, orgParams);
  if (!user) return Service.error("CREATE_FAILED");

  return Service.success(user);
}

export const UsersService = { create };
