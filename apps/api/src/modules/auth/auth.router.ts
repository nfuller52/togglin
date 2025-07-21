import type { AppContext } from "@/lib/modules/types";

import { withV1Router } from "@/lib/modules/router";
import { RegistrationsController } from "./controllers/registrations.controller";

export const createAuthRouter = withV1Router<AppContext>((context, router) => {
  router.post("/auth/register", RegistrationsController.post(context));
});
