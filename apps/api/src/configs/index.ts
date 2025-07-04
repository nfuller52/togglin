import { env } from "./env";
import { local } from "./environments/local";
import { test } from "./environments/test";
import type { ApplicationConfig } from "./types";

const applicationEnvironment: {
	local: ApplicationConfig;
	test: ApplicationConfig;
} = {
	local,
	test,
};

export const config = {
	...applicationEnvironment[env.NODE_ENV],
	env,
};
