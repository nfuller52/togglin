import { db } from "@db";
import { withOrgContext } from "@modules/common/tests/utils/with-org-context";
import { OrganizationQueries } from "@modules/tenants/queries/organization.queries";
import { createOrganization } from "../factories";

describe("OrganizationQueries.list", () => {
  it("lists organizations with pagination", async () => {
    const org = await createOrganization(db);

    withOrgContext(db, org.id, async () => {
      const result = await OrganizationQueries.list(db, {
        page: 1,
        limit: 100,
      });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toEqual(1);
    });
  });
});
