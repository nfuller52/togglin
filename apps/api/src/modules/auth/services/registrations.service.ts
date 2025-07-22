import type { ServiceDataSource } from "@/lib/db/types";

import { RegistrationCreateParams } from "@shared/schemas/registrations";
import { Service } from "@/lib/modules/service";
import { UsersService } from "@/modules/accounts";
import { AuthUsersQueries } from "../queries/auth-users.queries";
import { PasswordHasherService } from "./password-hasher.service";

async function create(db: ServiceDataSource, params: RegistrationCreateParams) {
  const [existingAuthUser, accountsUser] = await Promise.all([
    AuthUsersQueries.getByEmail(db, params.email),
    UsersService.find(db, { email: params.email }),
  ]);
  if (existingAuthUser || accountsUser.ok) return Service.error("USER_EXISTS");

  const password: string = await PasswordHasherService.hash(params.password);
  const authUserParams = { email: params.email, passwordHash: password };

  const authUser = await db.transaction().execute(async (trx) => {
    const newAuthUser = await AuthUsersQueries.insert(trx, authUserParams);
    if (!newAuthUser) throw new Error("Insert failed");

    await UsersService.create(trx, {
      email: params.email,
      name: params.name,
      authUserId: newAuthUser.id,
    });

    return newAuthUser;
  });

  return Service.success(authUser);
}

export const RegistrationsService = { create };
