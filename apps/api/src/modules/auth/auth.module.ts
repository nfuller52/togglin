import { createModule } from "@/lib/modules/module";
import { createAuthRouter } from "./auth.router";

export const initAuthModule = createModule(
  (context) => ({ ...context }),
  createAuthRouter,
);
