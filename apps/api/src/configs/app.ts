import type { ApplicationConfig } from "./types";

import { app as appConfig } from "./application";
import { loadEnvironment } from "./env";

const env = loadEnvironment();

export const app: ApplicationConfig & { env: typeof env } = {
  ...appConfig,
  env,
};
