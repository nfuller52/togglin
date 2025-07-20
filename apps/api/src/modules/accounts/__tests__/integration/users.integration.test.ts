import { Factory } from "@tests/factories";
import request from "supertest";

describe("POST /users", () => {
  it("returns a created user", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ name: "Test User", email: "test@example.com" })
      .expect(201);

    expect(res.body.name).toEqual("Test User");
  });

  it("returns errors without a payload", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(422);

    expect(res.body).toEqual({
      errors: ["Invalid or missing input"],
      fieldErrors: {},
      message: "Bad Request",
    });
  });

  it("returns field errors with malformed payload", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "Test User" })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(422);

    expect(res.body).toEqual({
      errors: [],
      fieldErrors: {
        email: { errors: ["This field is required."] },
      },
      message: "Bad Request",
    });
  });

  it("returns field errors with invalid user", async () => {
    const user = await Factory.createUser(db, { email: "test@example.com" });

    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "Test User", email: user.email })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(409);

    expect(res.body).toEqual({
      errors: [],
      fieldErrors: {
        email: { errors: ["Email is already in use."] },
      },
      message: "Bad Request",
    });
  });
});
