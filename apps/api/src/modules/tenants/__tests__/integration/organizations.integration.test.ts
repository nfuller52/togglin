import { Factory } from "@tests/factories";
import request from "supertest";

describe("GET /organizations", () => {
  it("returns paginated orgs", async () => {
    const user = await Factory.createUser(db);
    await Factory.createOrganizations(db, 10, { createdById: user.id });

    const res = await request(app)
      .get("/api/v1/organizations?page=1&limit=5")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(10);
  });
});

describe("POST /organizations", () => {
  it("returns a created org", async () => {
    const user = await Factory.createUser(db);

    const res = await request(app)
      .post("/api/v1/organizations")
      .expect("Content-Type", "application/json; charset=utf-8")
      .send({ name: "New Organization", createdById: user.id })
      .expect(201);

    expect(res.body.name).toEqual("New Organization");
  });

  it("returns errors without a payload", async () => {
    const res = await request(app)
      .post("/api/v1/organizations")
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
      .post("/api/v1/organizations")
      .send({ createdById: "test-owner-id" })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(422);

    expect(res.body).toEqual({
      errors: [],
      fieldErrors: {
        name: { errors: ["This field is required."] },
        createdById: { errors: ["This field must be a valid v4 uuid."] },
      },
      message: "Bad Request",
    });
  });

  it("returns field errors with invalid user", async () => {
    const res = await request(app)
      .post("/api/v1/organizations")
      .send({
        name: "Test Organization",
        createdById: "266489c0-25a5-4c47-851f-768bbdd8f682",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(404);

    expect(res.body).toEqual({
      errors: ["The requested user was not found."],
      fieldErrors: {},
      message: "Not Found",
    });
  });
});
