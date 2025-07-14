import type { ITenantsModule } from "./types";

import { OrganizationService } from "./services/organizations.service";
import { initTenantsModule } from "./tenants.module";

export const TenantsModule: ITenantsModule = {
  initTenantsModule,
  OrganizationService,
};
