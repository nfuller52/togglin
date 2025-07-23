import type { ServiceDataSource } from "@/lib/db/types";

import { OrganizationService } from "@modules/tenants/services/organizations.service";
import { OrganizationCreateParams } from "@shared/schemas/organizations";
import { Factory } from "@tests/factories";

describe("OrganizationService", () => {
  describe("list", () => {
    it("returns a paginated list of organizations with total count", async () => {
      const user = await Factory.createUser(db);
      await Factory.createOrganizations(db, 10, { createdById: user.id });

      const result = await OrganizationService.list(db, {
        page: 1,
        limit: 5,
      });

      expect(result.ok).toBe(true);
      expect(result.data!.data.length).toBe(5);
      expect(result.data!.total).toBe(10);
    });

    it("returns an error when the query fails", async () => {
      const result = await OrganizationService.list({} as ServiceDataSource, {
        page: 1,
        limit: 5,
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe("DB_ERROR");
    });
  });

  describe("get", () => {
    it("returns a single organization by id", async () => {
      const user = await Factory.createUser(db);
      const org = await Factory.createOrganization(db, {
        createdById: user.id,
      });

      const result = await OrganizationService.get(db, org.id);

      expect(result.ok).toBe(true);
      expect(result.data!.id).toBe(org.id);
    });

    it("returns NOT_FOUND for a missing id", async () => {
      const result = await OrganizationService.get(db, "invalid-uuid");

      expect(result.ok).toBe(false);
      expect(result.error).toBe("NOT_FOUND");
    });
  });

  describe("create", () => {
    it("creates an organization successfully", async () => {
      const user = await Factory.createUser(db);
      const orgParams = {
        name: "Test Org",
        createdById: user.id,
      };

      const result = await OrganizationService.create(db, orgParams);

      expect(result.ok).toBe(true);
      expect(result.data!.name).toBe("Test Org");
    });

    it("returns USER_NOT_FOUND when requesting user does not exist", async () => {
      const result = await OrganizationService.create(db, {
        name: "Test Org",
        createdById: "invalid",
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe("USER_NOT_FOUND");
    });

    it("returns CREATE_FAILED when creation fails", async () => {
      const user = await Factory.createUser(db);
      const result = await OrganizationService.create(db, {
        name: null,
        createdById: user.id,
      } as unknown as OrganizationCreateParams); // gotta hack this to raise the error

      expect(result.ok).toBe(false);
      expect(result.error).toBe("CREATE_FAILED");
    });
  });
});
