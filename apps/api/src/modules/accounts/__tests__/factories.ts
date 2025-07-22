import type { DB } from "@/lib/db/db";
import type { Insertable, Kysely } from "kysely";

import { app } from "@app";
import { faker } from "@faker-js/faker";
import { createAuthUser } from "@/modules/auth/__tests__/factories";
import { ACCOUNTS_USERS_TABLE } from "../constants";

export function userFactory(
  overrides: Partial<Insertable<DB["accountsUsers"]>> = {},
): Partial<Insertable<DB["accountsUsers"]>> {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email({ provider: "faker.togglin.io" }),
    ...overrides,
  };
}

export async function createUser(
  db: Kysely<DB>,
  overrides: Partial<Insertable<DB["accountsUsers"]>> & {
    password?: string;
  } = {},
) {
  if (app.env.NODE_ENV !== "test") {
    throw new Error(`Factories are not available in ${app.env.NODE_ENV}`);
  }

  const userAttrs = userFactory(overrides);

  if (overrides.authUserId) {
    userAttrs.authUserId = overrides.authUserId;
  } else {
    const authUser = await createAuthUser(db, { password: overrides.password });
    userAttrs.authUserId = authUser.id;
  }

  if (!userAttrs.authUserId) throw new Error(`createUser requires an authUser`);

  const insertableUserAttrs = userAttrs as Insertable<DB["accountsUsers"]>;

  const user = await db
    .insertInto(ACCOUNTS_USERS_TABLE)
    .values(insertableUserAttrs)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    throw new Error("Failed to insert user");
  }

  return user;
}
