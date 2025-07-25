import type { AuthUsers } from "@/lib/db/db";
import type { Selectable } from "kysely";

import { app } from "@app";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";

const SECRET_TOKEN = new TextEncoder().encode(app.env.ACCESS_TOKEN_SECRET);

async function create(authUser: Selectable<AuthUsers>, orgId?: string) {
  const claims = {
    sub: authUser.id,
    iss: app.env.HOST_URL,
    aud: [app.env.HOST_URL],
    email: authUser.email,
    jti: nanoid(),
    ...(orgId ? { orgId } : {}),
  };

  return await new SignJWT(claims)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(`${app.env.ACCESS_TOKEN_EXPIRATION_IN_SECONDS}s`)
    .sign(SECRET_TOKEN);
}

export const AccessTokensService = { create };
