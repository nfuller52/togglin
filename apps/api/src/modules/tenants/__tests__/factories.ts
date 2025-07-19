import type { DB } from "@/lib/db/db";
import type { Insertable, Kysely } from "kysely";

import { faker } from "@faker-js/faker";
import { TENANTS_ORGANIZATIONS_TABLE } from "../constants";

export function organizationFactory(
  overrides: Partial<Insertable<DB["tenantsOrganizations"]>> = {},
): Insertable<DB["tenantsOrganizations"]> {
  if (!overrides.ownerId) {
    throw new Error(
      "REQUIRED ASSOCIATION: organizationFactory requires an `ownerId` (user)",
    );
  }

  return {
    name: faker.company.name(),
    ownerId: faker.string.uuid(), // ! this will fail to insert without a real association
    ...overrides,
  };
}

export async function createOrganization(db: Kysely<DB>, overrides = {}) {
  const orgAttrs = organizationFactory(overrides);

  const org = await db
    .insertInto(TENANTS_ORGANIZATIONS_TABLE)
    .values(orgAttrs)
    .returningAll()
    .executeTakeFirst();

  if (!org) {
    throw new Error("failed");
  }

  return org;
}

export async function createOrganizations(
  db: Kysely<DB>,
  count: number,
  overrides = {},
) {
  const queries = [];

  for (let index = 0; index < count; index++) {
    queries.push(createOrganization(db, overrides));
  }

  return Promise.all(queries);
}
