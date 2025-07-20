import type { AppContext } from "@/lib/modules/types";
import type { Express } from "express";

import { UsersService } from "./services/users.service";

export interface IAccountsModule {
  initAccountsModule: (app: Express, context: AppContext) => void;
}

export interface AccountsContext extends AppContext {
  services: {
    UsersService: typeof UsersService;
  };
}
