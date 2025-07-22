import { Factory } from "@tests/factories";
import { AuthUsersQueries } from "@/modules/auth/queries/auth-users.queries";

describe("AuthUsersQueries", () => {
  describe("getByEmail", () => {
    it("returns a single organization by id", async () => {
      const user = await Factory.createAuthUser(db);

      const result = await AuthUsersQueries.getByEmail(db, user.email);
      expect(result?.id).toEqual(user.id);
    });

    it("returns undefined for non-existent user", async () => {
      const result = await AuthUsersQueries.getByEmail(db, "test@example.com");
      expect(result).toBeUndefined();
    });
  });

  describe("insert", () => {
    it("creates a new authUser record", async () => {
      const userAttrs = await Factory.authUserFactory();

      const result = await AuthUsersQueries.insert(db, userAttrs);
      expect(result).not.toBeUndefined();
    });
  });
});
