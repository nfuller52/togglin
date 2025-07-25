import type { AuthOauthRefreshTokens, DB } from "@/lib/db/db";
import type { Insertable, Kysely } from "kysely";

import { app } from "@app";
import { DateTime } from "@/lib/inflections/datetime";
import { AUTH_OAUTH_REFRESH_TOKENS_TABLE } from "../constants";

async function tokenExists(db: Kysely<DB>, tokenId: string) {
  return db
    .selectFrom(AUTH_OAUTH_REFRESH_TOKENS_TABLE)
    .select("id")
    .where("shortId", "=", tokenId)
    .executeTakeFirst();
}

async function insert(
  db: Kysely<DB>,
  params: Insertable<AuthOauthRefreshTokens>,
) {
  return db
    .insertInto(AUTH_OAUTH_REFRESH_TOKENS_TABLE)
    .values(params)
    .returningAll()
    .executeTakeFirst();
}

async function revokeExcessRefreshTokens(
  db: Kysely<DB>,
  authUserId: string,
  replacedByTokenId: string,
) {
  const tokensIdsToRevoke = await db
    .selectFrom(AUTH_OAUTH_REFRESH_TOKENS_TABLE)
    .select("id")
    .where("authUserId", "=", authUserId)
    .where("revokedReason", "is", null)
    .orderBy("createdAt", "desc")
    .offset(app.env.MAX_USER_SESSIONS)
    .execute();

  if (tokensIdsToRevoke.length === 0) return;

  const updatedAt = DateTime.now();

  return db
    .updateTable(AUTH_OAUTH_REFRESH_TOKENS_TABLE)
    .set({
      revokedAt: updatedAt,
      revokedReason: "rotation",
      replacedByTokenId,
      updatedAt,
    })
    .where(
      "id",
      "in",
      tokensIdsToRevoke.map((r) => r.id),
    )
    .execute();
}

export const OAuthRefreshTokensQueries = {
  insert,
  revokeExcessRefreshTokens,
  tokenExists,
};
