import type { AppContext } from "@/lib/modules/types";
import type { Request, Response } from "express";

import {
  RegistrationCreateSchema,
  RegistrationResponseSchema,
} from "@shared/schemas/registrations";
import { HttpError } from "@/lib/http/errors/http-errors.js";
import { HTTP } from "@/lib/http/status.js";
import { REGISTRATIONS_ERRORS } from "../auth.errors";
import { RegistrationsService } from "../services/registrations.service";

function post(context: AppContext) {
  return async (req: Request, res: Response) => {
    const response = await RegistrationsService.create(
      context.db,
      RegistrationCreateSchema.parse(req.body),
    );
    if (!response.ok) throw new HttpError(REGISTRATIONS_ERRORS[response.error]);

    const formattedAuthUser = RegistrationResponseSchema.parse(response.data);
    res.status(HTTP.CREATED).json(formattedAuthUser);
  };
}

export const RegistrationsController = { post };
