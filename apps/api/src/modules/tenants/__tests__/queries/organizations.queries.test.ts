import { Factory } from "@tests/factories";
import { OrganizationQueries } from "@/modules/tenants/queries/organizations.queries";

describe("OrganizationQueries", () => {
  describe("list", () => {
    it("returns a paginated list of organizations", async () => {
      const user = await Factory.createUser(db);
      await Factory.createOrganizations(db, 15, { ownerId: user.id });

      const results = await OrganizationQueries.list(db, {
        page: 1,
        limit: 10,
      });

      expect(results).toHaveLength(10);
      expect(results[0]).toHaveProperty("id");
    });

    it("respects page and offset", async () => {
      const user = await Factory.createUser(db);
      const created = await Factory.createOrganizations(db, 15, {
        ownerId: user.id,
      });

      const page1 = await OrganizationQueries.list(db, {
        page: 1,
        limit: 5,
      });

      const page2 = await OrganizationQueries.list(db, {
        page: 2,
        limit: 5,
      });

      expect(page1).toHaveLength(5);
      expect(page2).toHaveLength(5);
      expect(page2[0].id).toEqual(created[5].id);
    });
  });

  describe("count", () => {
    it("returns the total number of organizations", async () => {
      const user = await Factory.createUser(db);
      await Factory.createOrganizations(db, 7, { ownerId: user.id });

      const countResult = await OrganizationQueries.count(db);

      expect(countResult?.count).toEqual(7);
    });
  });

  describe("get", () => {
    it("returns a single organization by id", async () => {
      const user = await Factory.createUser(db);
      const org = await Factory.createOrganization(db, { ownerId: user.id });

      const result = await OrganizationQueries.get(db, org.id);
      expect(result?.id).toEqual(org.id);
    });

    it("returns undefined for non-existent id", async () => {
      const result = await OrganizationQueries.get(
        db,
        "663dd02f-bae9-4e0c-b6b7-f0501d6b4bcd",
      );
      expect(result).toBeUndefined();
    });
  });
});
