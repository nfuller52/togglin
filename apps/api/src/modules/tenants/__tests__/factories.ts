import type { DB } from "@/lib/db/db";
import type { Kysely } from "kysely";

import { faker } from "@faker-js/faker";
import { TENANTS_ORGANIZATIONS_TABLE } from "../constants";

export function organizationFactory(overrides: Partial<DB> = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    ...overrides,
  };
}

export async function createOrganization(db: Kysely<DB>, overrides = {}) {
  const org = organizationFactory(overrides);

  await db.insertInto(TENANTS_ORGANIZATIONS_TABLE).values(org).execute();

  return org;
}
