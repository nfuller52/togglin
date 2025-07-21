import type { IAuthModule } from "./types";

import { initAuthModule } from "./auth.module";

export const AuthModule: IAuthModule = {
  initAuthModule,
};
