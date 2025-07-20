import type { IAccountsModule } from "./types";

import { initAccountsModule } from "./accounts.module";

export { UsersService } from "./services/users.service";

export const AccountsModule: IAccountsModule = {
  initAccountsModule,
};
