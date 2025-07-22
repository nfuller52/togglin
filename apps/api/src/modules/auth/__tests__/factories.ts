import type { DB } from "@/lib/db/db";
import type { Insertable, Kysely } from "kysely";

import { app } from "@app";
import { faker } from "@faker-js/faker";
import { AUTH_USERS_TABLE } from "../constants";
import { PasswordHasherService } from "../services/password-hasher.service";

export async function authUserFactory(
  overrides: Partial<Insertable<DB["authUsers"]>> & { password?: string } = {},
): Promise<Insertable<DB["authUsers"]>> {
  let passwordHash = await PasswordHasherService.hash(
    overrides?.password ?? app.env.DEFAULT_TEST_USER_PASSWORD,
  );

  return {
    email: faker.internet.email({ provider: "faker.togglin.io" }),
    passwordHash,
    ...overrides,
  };
}

export async function createAuthUser(db: Kysely<DB>, overrides = {}) {
  if (app.env.NODE_ENV !== "test") {
    throw new Error(`Factories are not available in ${app.env.NODE_ENV}`);
  }

  const userAttrs = await authUserFactory(overrides);

  const user = await db
    .insertInto(AUTH_USERS_TABLE)
    .values(userAttrs)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    throw new Error("Failed to insert user");
  }

  return user;
}
