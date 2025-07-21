import type { RequestHandler } from "express";

import { app as appConfig } from "@app";
import { db } from "@db";
import { httpLogger, logger } from "@logger";
import { AccountsModule } from "@modules/accounts";
import { AuthModule } from "@modules/auth";
import { TenantsModule } from "@modules/tenants";
import express from "express";
import { NotFoundError } from "@/lib/http/errors/http-errors";
import { Middleware } from "@/lib/middleware";
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
  app.use(Middleware.MalformedJsonErrorHandler);
  app.use(OrgIdMiddleware);

  // Routes
  AccountsModule.initAccountsModule(app, appContext);
  AuthModule.initAuthModule(app, appContext);
  TenantsModule.initTenantsModule(app, appContext);

  // Catch-all Route 404 Handler
  app.use((_req, _res, next) => next(new NotFoundError()));

  app.use(Middleware.ZodErrorHandler);
  app.use(Middleware.HttpErrorHandler);
  app.use(Middleware.withContext(appContext, Middleware.InternalErrorHandler));

  return app;
}
