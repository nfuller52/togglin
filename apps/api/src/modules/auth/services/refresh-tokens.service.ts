import type { AuthUsers } from "@/lib/db/db";
import type { ServiceDataSource } from "@/lib/db/types";
import type { Selectable } from "kysely";

import { app } from "@app";
import { nanoid } from "nanoid";
import { DateTime } from "@/lib/inflections/datetime";
import { Service } from "@/lib/modules/service";
import { OAuthRefreshTokensQueries } from "../queries/oauth-refresh-tokens.queries";

async function create(db: ServiceDataSource, authUser: Selectable<AuthUsers>) {
  let shortId: string;

  while (true) {
    shortId = nanoid();
    const tokenInDb = await OAuthRefreshTokensQueries.tokenExists(db, shortId);

    if (!tokenInDb) break;
  }

  const refreshToken = await OAuthRefreshTokensQueries.insert(db, {
    authUserId: authUser.id,
    shortId: shortId,
    expiresAt: DateTime.secondsFromNow(
      app.env.REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
    ),
  });
  if (!refreshToken) return Service.error("REFRESH_TOKEN_FAILURE");

  await OAuthRefreshTokensQueries.revokeExcessRefreshTokens(
    db,
    authUser.id,
    refreshToken.id,
  );

  return Service.success(refreshToken);
}

export const RefreshTokensService = { create };
