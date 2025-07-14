import type { RequestHandler } from "express";

import { app as appConfig } from "@app";
import { db } from "@db";
import { httpLogger, logger } from "@logger";
import { TenantsModule } from "@modules/tenants";
import express from "express";
import { OrgIdMiddleware } from "@/middleware/org-id-middleware";

export async function createApp() {
  const app = express();

  const appContext = {
    app: { env: appConfig.env.NODE_ENV },
    db,
    logger,
  };

  // Middlware
  app.use(httpLogger as unknown as RequestHandler);
  app.use(express.json());
  app.use(OrgIdMiddleware);

  // Routes
  TenantsModule.initTenantsModule(app, appContext);

  return app;
}
