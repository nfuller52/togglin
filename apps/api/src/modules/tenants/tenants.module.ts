import { createModule } from "@/lib/modules/module";
import { OrganizationService } from "./services/organizations.service";
import { createTenantsRouter } from "./tenants.router";

export const initTenantsModule = createModule(
  (context) => ({ ...context, services: { OrganizationService } }),
  createTenantsRouter,
);
