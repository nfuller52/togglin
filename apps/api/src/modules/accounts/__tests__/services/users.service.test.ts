import { UsersService } from "@modules/accounts/services/users.service";
import { Factory } from "@tests/factories";

describe("UsersService", () => {
  describe(".find", () => {
    it("searches by id when present", async () => {
      const user = await Factory.createUser(db);
      const result = await UsersService.find(db, { id: user.id });

      expect(result.ok).toBeTruthy();
      expect(result.error).toBeNull();
      expect(result.data).toEqual(user);
    });

    it("searches by email when present", async () => {
      const user = await Factory.createUser(db);
      const result = await UsersService.find(db, { email: user.email });

      expect(result.ok).toBeTruthy();
      expect(result.error).toBeNull();
      expect(result.data).toEqual(user);
    });

    it("returns `USER_NOT_FOUND` when params are empty", async () => {
      const result = await UsersService.find(db, {});

      expect(result.ok).toBeFalsy();
      expect(result.data).toBeNull();
      expect(result.error).toEqual("USER_NOT_FOUND");
    });

    it("returns `USER_NOT_FOUND` when params are invalid", async () => {
      const result = await UsersService.find(db, { id: "invalid-string" });

      expect(result.ok).toBeFalsy();
      expect(result.data).toBeNull();
      expect(result.error).toEqual("USER_NOT_FOUND");
    });
  });
});
