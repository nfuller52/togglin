import { createModule } from "@/lib/modules/module";
import { createAccountsRouter } from "./accounts.router";
import { UsersService } from "./services/users.service";

export const initAccountsModule = createModule(
  (context) => ({ ...context, services: { UsersService } }),
  createAccountsRouter,
);
