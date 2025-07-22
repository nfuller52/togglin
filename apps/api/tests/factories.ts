import * as AccountsFactory from "@modules/accounts/__tests__/factories";
import * as AuthFactory from "@modules/auth/__tests__/factories";
import * as TenantsFactory from "@modules/tenants/__tests__/factories";

export const Factory = {
  ...AccountsFactory,
  ...AuthFactory,
  ...TenantsFactory,
};
