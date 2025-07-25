import type { AppContext } from "@/lib/modules/types";

import { withV1Router } from "@/lib/modules/router";
import { LoginsController } from "./controllers/logins.controller";
import { RegistrationsController } from "./controllers/registrations.controller";

export const createAuthRouter = withV1Router<AppContext>((context, router) => {
  router.post("/auth/login", LoginsController.post(context));
  router.post("/auth/register", RegistrationsController.post(context));
});
