import type { AppContext } from "@/lib/modules/types";
import type { Request, Response } from "express";

import { LoginCreateSchema } from "@shared/schemas/logins";
import { TokenResponseSchema } from "@shared/schemas/tokens";
import { HttpError } from "@/lib/http/errors/http-errors";
import { HTTP } from "@/lib/http/status";
import { LOGINS_ERRORS } from "../auth.errors";
import { LoginsService } from "../services/logins.service";

function post(context: AppContext) {
  return async (req: Request, res: Response) => {
    const response = await LoginsService.create(
      context.db,
      LoginCreateSchema.parse(req.body),
    );
    if (!response.ok) throw new HttpError(LOGINS_ERRORS[response.error]);

    const tokens = TokenResponseSchema.parse(response.data);
    res.status(HTTP.CREATED).json(tokens);
  };
}

export const LoginsController = { post };
