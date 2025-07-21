import { PasswordHasherService } from "../../services/password-hasher.service";

describe("hash", async () => {
  it("successfully hashes a value", async () => {
    const value = "test-value";

    expect(await PasswordHasherService.hash(value)).toMatch("$argon2");
  });
});

describe("verify", async () => {
  it("successfully validates a value", async () => {
    const value = "test-value";
    const hashedValue = await PasswordHasherService.hash(value);

    expect(await PasswordHasherService.verify(hashedValue, value)).toBeTruthy();
  });

  it("rejects invalid passwords", async () => {
    const hashedValue = await PasswordHasherService.hash("test-value");

    expect(
      await PasswordHasherService.verify(hashedValue, "invalid-password"),
    ).toBeFalsy();
  });
});
