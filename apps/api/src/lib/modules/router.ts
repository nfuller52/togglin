import type { AppContext } from "@/lib/modules/types";

import { withContext } from "@lib/middleware/with-context";
import { Router } from "express";
import { HttpErrorHandler } from "@/lib/middleware/http-error-handler";
import { InternalErrorHandler } from "@/lib/middleware/internal-error-handler";
import { ZodErrorHandler } from "@/lib/middleware/zod-error-handler";

export function withV1Router<TContext extends AppContext>(
  setup: (context: TContext, router: Router) => void,
) {
  return (context: TContext) => {
    const router = Router();
    const v1Router = Router();

    setup(context, router);

    v1Router.use("/api/v1", router);

    // Register Error Handlers
    v1Router.use(ZodErrorHandler);
    v1Router.use(HttpErrorHandler);
    v1Router.use(withContext(context, InternalErrorHandler));

    return v1Router;
  };
}
