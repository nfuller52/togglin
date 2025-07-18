import type { ServiceDataSource } from "@/lib/db/types";
import type { InferServiceResult } from "@/lib/modules/types";
import type { UserCreateParams } from "@shared/schemas/users";

import { UsersQueries } from "../queries/users.queries";

type CreateUserErrors = "EMAIL_TAKEN" | "CREATE_FAILED";
type CreateServiceResponse = InferServiceResult<
  typeof UsersQueries.createUser,
  CreateUserErrors
>;

async function create(
  db: ServiceDataSource,
  orgParams: UserCreateParams,
): CreateServiceResponse {
  const userExists = await UsersQueries.getByEmail(db, orgParams.email);
  if (userExists) return { ok: false, error: "EMAIL_TAKEN", data: null };

  const user = await UsersQueries.createUser(db, orgParams);
  if (!user) return { ok: false, error: "CREATE_FAILED", data: null };

  return { ok: true, error: null, data: user };
}

export const UsersService = { create };
