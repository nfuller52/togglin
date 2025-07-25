import { withV1Router } from "@/lib/modules/router";
import { AccountsContext } from "./types";

export const createAccountsRouter = withV1Router<AccountsContext>(
  (context, router) => {
    context.logger.error(`No routes for Accounts Module! ${router}`);
  },
);
