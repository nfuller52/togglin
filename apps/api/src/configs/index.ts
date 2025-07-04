import { env } from "./env";
import { local } from "./environments/local";
import type { ApplicationConfig } from "./types";

const applicationEnvironment: {
	local: ApplicationConfig;
} = {
	local: local,
};

export const config = {
	...applicationEnvironment[env.NODE_ENV],
	env,
};
