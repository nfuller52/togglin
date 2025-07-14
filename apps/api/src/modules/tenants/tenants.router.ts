import { withV1Router } from "@/lib/modules/router";
import { OrganizationsController } from "./controllers/organizations.controller";
import { TenantsContext } from "./types";

export const createTenantsRouter = withV1Router<TenantsContext>(
  (context, router) => {
    router.get("/organizations", OrganizationsController.list(context));
  },
);
