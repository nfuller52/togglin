import { withV1Router } from "@/lib/modules/router";
import { UsersController } from "./controllers/users.controller";
import { AccountsContext } from "./types";

export const createAccountsRouter = withV1Router<AccountsContext>(
  (context, router) => {
    router.post("/users", UsersController.post(context));
  },
);
