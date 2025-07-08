import type { ApplicationConfig } from "./types";

import { env } from "./env";

let appConfig: ApplicationConfig;

switch (env.NODE_ENV) {
  case "test": {
    const { app } = require("./environments/test");
    appConfig = app;
    break;
  }
  case "local":
  default: {
    const { app } = require("./environments/local");
    appConfig = app;
    break;
  }
}

export const config: ApplicationConfig & { env: typeof env } = {
  ...appConfig,
  env,
};
