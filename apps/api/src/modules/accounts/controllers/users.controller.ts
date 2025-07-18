import type { Request, Response } from "express";
import type { AccountsContext } from "../types";

import { UserCreateSchema, UserResponseSchema } from "@shared/schemas/users";
import { HttpError } from "@/lib/http/errors/http-errors";
import { HTTP } from "@/lib/http/status";
import { USERS_CREATE_ERRORS } from "../accounts.errors";
import { UsersService } from "../services/users.service";

function post(context: AccountsContext) {
  return async (req: Request, res: Response) => {
    const response = await UsersService.create(
      context.db,
      UserCreateSchema.parse(req.body),
    );
    if (!response.ok) throw new HttpError(USERS_CREATE_ERRORS[response.error]);

    const formattedUser = UserResponseSchema.parse(response.data);
    res.status(HTTP.CREATED).json(formattedUser);
  };
}

export const UsersController = { post };
