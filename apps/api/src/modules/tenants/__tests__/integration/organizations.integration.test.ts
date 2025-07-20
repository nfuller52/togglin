import type { Express } from "express";

import request from "supertest";
import { Factory } from "tests/factories";
import { createApp } from "@/app";

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

describe("GET /organizations", () => {
  it("returns paginated orgs", async () => {
    const user = await Factory.createUser(db);
    await Factory.createOrganizations(db, 10, { ownerId: user.id });

    const res = await request(app)
      .get("/api/v1/organizations?page=1&limit=5")
      .set("X-Organization-ID", "fake")
      .expect(200);

    expect(res.body.data).toHaveLength(5);
    expect(res.body.total).toBe(7);
  });
});
