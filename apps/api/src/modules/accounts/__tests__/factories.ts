import type { DB } from "@/lib/db/db";
import type { Insertable, Kysely } from "kysely";

import { app } from "@app";
import { faker } from "@faker-js/faker";
import { ACCOUNTS_USERS_TABLE } from "../constants";

export function userFactory(
  overrides: Partial<Insertable<DB["accountsUsers"]>> = {},
): Insertable<DB["accountsUsers"]> {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({ provider: "faker.togglin.io" }),
    ...overrides,
  };
}

export async function createUser(db: Kysely<DB>, overrides = {}) {
  if (app.env.NODE_ENV !== "test") {
    throw new Error(`Factories are not available in ${app.env.NODE_ENV}`);
  }

  const userAttrs = userFactory(overrides);

  const user = await db
    .insertInto(ACCOUNTS_USERS_TABLE)
    .values(userAttrs)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    throw new Error("Failed to insert user");
  }

  return user;
}
