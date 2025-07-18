import type { AppContext } from "@/lib/modules/types";

import { Router } from "express";

export function withV1Router<TContext extends AppContext>(
  setup: (context: TContext, router: Router) => void,
) {
  return (context: TContext) => {
    const router = Router();
    const v1Router = Router();

    setup(context, router);

    v1Router.use("/api/v1", router);

    return v1Router;
  };
}
