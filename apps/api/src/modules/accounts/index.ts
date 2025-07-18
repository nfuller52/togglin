import type { IAccountsModule } from "./types";

import { initAccountsModule } from "./accounts.module";
import { UsersService } from "./services/users.service";

export const AccountsModule: IAccountsModule = {
  initAccountsModule,
  UsersService,
};
