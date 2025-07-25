import type { ServiceDataSource } from "@/lib/db/types";

import { LoginCreateParams } from "@shared/schemas/logins";
import { Service } from "@/lib/modules/service";
import { tryCatch } from "@/utils/try-catch";
import { AuthUsersQueries } from "../queries/auth-users.queries";
import { AccessTokensService } from "./access-tokens.service";
import { PasswordHasherService } from "./password-hasher.service";
import { RefreshTokensService } from "./refresh-tokens.service";

async function create(db: ServiceDataSource, params: LoginCreateParams) {
  const { email, password } = params;

  const authUser = await AuthUsersQueries.getByEmail(db, email);
  if (!authUser) return Service.error("INVALID_LOGIN");

  const passwordCheck = await PasswordHasherService.verify(
    authUser.passwordHash,
    password,
  );
  if (!passwordCheck) return Service.error("INVALID_LOGIN");

  const tokens = await tryCatch(
    Promise.all([
      AccessTokensService.create(authUser),
      RefreshTokensService.create(db, authUser),
    ]),
  );
  if (tokens.error) return Service.error("INVALID_LOGIN");

  const [accessToken, refreshToken] = tokens.data;

  if (!refreshToken.data) return Service.error("INVALID_LOGIN");

  return Service.success({
    accessToken: accessToken,
    refreshToken: refreshToken.data.shortId,
  });
}

export const LoginsService = { create };
