import type { RequestHandler } from "express";

import { db } from "@db";
import { httpLogger } from "@logger";
import express, { Router } from "express";

export async function createApp() {
  const app = express();

  // Middlware
  app.use(httpLogger as unknown as RequestHandler);
  app.use(express.json());

  // Routes
  const helloWorld = Router();
  helloWorld.get("/", async (req, res) => {
    const result = await db
      .selectFrom("tenants_organizations")
      .selectAll()
      .executeTakeFirst();

    res.send({ hello: result });
  });
  app.use("/api", helloWorld);

  return app;
}
