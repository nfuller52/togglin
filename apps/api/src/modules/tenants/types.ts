import type { AppContext } from "@/lib/modules/types";
import type { Express } from "express";

import { OrganizationService } from "./services/organizations.service";

export interface ITenantsModule {
  initTenantsModule: (app: Express, context: AppContext) => void;
  OrganizationService: typeof OrganizationService;
}

export interface TenantsContext extends AppContext {
  services: {
    OrganizationService: typeof OrganizationService;
  };
}
