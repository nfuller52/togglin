import type { AppContext } from "@/lib/modules/types";
import type { Express } from "express";

export interface IAuthModule {
  initAuthModule: (app: Express, context: AppContext) => void;
}
