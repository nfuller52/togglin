import { db as NonTransactionalDb } from "@db";
import { RegistrationsService } from "@modules/auth/services/registrations.service";
import { Factory } from "@tests/factories";
import { truncateAll } from "../../../../../tests/utils/reset-db";

describe("RegistrationsService", () => {
  describe("create", () => {
    let newUserPayload = {
      name: "Test User",
      email: "test@example.com",
      password: "superSecret3Password!@#$%",
      passwordConfirmation: "superSecret3Password!@#$%",
    };

    describe("with real db inserts", () => {
      beforeEach(() => {
        truncateAll();
      });

      afterEach(() => {
        truncateAll();
      });

      it("registers a new user", async () => {
        const result = await RegistrationsService.create(
          NonTransactionalDb,
          newUserPayload,
        );

        expect(result.ok).toBe(true);
      });
    });

    it("fails when an auth user already exists with same email", async () => {
      await Factory.createAuthUser(db, { email: newUserPayload.email });

      const result = await RegistrationsService.create(db, newUserPayload);

      expect(result.ok).toBe(false);
      expect(result.error).toEqual("USER_EXISTS");
    });

    it("fails when an account user already exists with same email", async () => {
      const authUser = await Factory.createAuthUser(db);
      await Factory.createUser(db, {
        email: newUserPayload.email,
        authUserId: authUser.id,
      });

      const result = await RegistrationsService.create(db, newUserPayload);

      expect(result.ok).toBe(false);
      expect(result.error).toEqual("USER_EXISTS");
    });
  });
});
