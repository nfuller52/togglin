import type { Express, Router } from "express";
import type { AppContext } from "./types";

export function createModule<TContext extends AppContext>(
  extendContext: (context: AppContext) => TContext,
  createRouter: (context: TContext) => Router,
): (app: Express, context: AppContext) => void;

export function createModule(
  extendContext: (context: AppContext) => unknown,
  createRouter: (context: unknown) => Router,
) {
  return function initModule(app: Express, appContext: AppContext) {
    const moduleContext = extendContext(appContext);
    const router = createRouter(moduleContext);
    app.use(router);
  };
}
