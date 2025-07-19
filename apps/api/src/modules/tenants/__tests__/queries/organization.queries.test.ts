import { OrganizationQueries } from "@modules/tenants/queries/organization.queries";
import { Factory } from "tests/factories";

describe("OrganizationQueries.list", () => {
  it("lists organizations with pagination", async () => {
    const user = await Factory.createUser(db);
    await Factory.createOrganizations(db, 10, { ownerId: user?.id });

    const result = await OrganizationQueries.list(db, {
      page: 1,
      limit: 100,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toEqual(10);
  });
});
