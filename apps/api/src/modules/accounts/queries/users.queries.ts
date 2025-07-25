import type { DB } from "@/lib/db/db";
import type { UserCreateParams } from "@shared/schemas/users";
import type { Kysely } from "kysely";

import { ACCOUNTS_USERS_TABLE } from "../constants";

async function getById(db: Kysely<DB>, id: string) {
  return db
    .selectFrom(ACCOUNTS_USERS_TABLE)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

async function getByEmail(db: Kysely<DB>, email: string) {
  return db
    .selectFrom(ACCOUNTS_USERS_TABLE)
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();
}

async function createUser(db: Kysely<DB>, params: UserCreateParams) {
  return db
    .insertInto(ACCOUNTS_USERS_TABLE)
    .values(params)
    .returningAll()
    .executeTakeFirst();
}

export const UsersQueries = { createUser, getByEmail, getById };
