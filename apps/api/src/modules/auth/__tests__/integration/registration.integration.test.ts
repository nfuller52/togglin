import request from "supertest";
import { UsersService } from "@/modules/accounts";

describe("new user registration", () => {
  it("creates an auth user and user account", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      email: "test@example.com",
    });

    // it should create an accounts user
    const authUserResult = await UsersService.find(db, {
      email: res.body.email,
    });

    if (!authUserResult.ok || !authUserResult.data)
      throw new Error("Expected UsersService to find user");

    expect(authUserResult.ok).toBeTruthy();
    expect(authUserResult.error).toBeNull();
    expect(authUserResult.data.email).toBe("test@example.com");
  });
});
