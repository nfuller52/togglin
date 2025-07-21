import type { ServiceDataSource } from "@/lib/db/types";
import type { UserCreateParams } from "@shared/schemas/users";

import { Service } from "@/lib/modules/service";
import { tryCatch } from "@/utils/try-catch";
import { UsersQueries } from "../queries/users.queries";

type UserFindParams = {
  id?: string;
  email?: string;
};

async function get(db: ServiceDataSource, id: string) {
  const { data, error } = await tryCatch(UsersQueries.getById(db, id));
  if (!data || error) return Service.error("USER_NOT_FOUND");

  return Service.success(data);
}

async function create(db: ServiceDataSource, orgParams: UserCreateParams) {
  const userExists = await UsersQueries.getByEmail(db, orgParams.email);
  if (userExists) return Service.error("EMAIL_TAKEN");

  const user = await UsersQueries.createUser(db, orgParams);
  if (!user) return Service.error("CREATE_FAILED");

  return Service.success(user);
}

async function find(db: ServiceDataSource, params: UserFindParams) {
  let result;

  if (params.id) {
    const query = await tryCatch(UsersQueries.getById(db, params.id));
    if (!query || query.error) return Service.error("USER_NOT_FOUND");

    result = query;
  } else if (params.email) {
    const query = await tryCatch(UsersQueries.getByEmail(db, params.email));
    if (!query || query.error) return Service.error("USER_NOT_FOUND");

    result = query;
  }

  if (!result) return Service.error("USER_NOT_FOUND");

  return Service.success(result.data);
}

export const UsersService = { create, find, get };
