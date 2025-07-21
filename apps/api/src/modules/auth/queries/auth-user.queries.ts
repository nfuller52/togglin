import type { DB } from "@/lib/db/db";
import type { Kysely } from "kysely";

import { AuthUserCreateParams } from "@shared/schemas/auth-users";
import { AUTH_USERS_TABLE } from "../constants";

async function getByEmail(db: Kysely<DB>, email: string) {
  return db
    .selectFrom(AUTH_USERS_TABLE)
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

async function insert(db: Kysely<DB>, params: AuthUserCreateParams) {
  return db
    .insertInto(AUTH_USERS_TABLE)
    .values(params)
    .returningAll()
    .executeTakeFirst();
}

export const AuthUsersQueries = { insert, getByEmail };
