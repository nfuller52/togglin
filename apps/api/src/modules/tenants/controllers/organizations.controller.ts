import type { Request, Response } from "express";
import type { TenantsContext } from "../types";

import {
  OrganizationCreateSchema,
  OrganizationResponseSchema,
} from "@shared/schemas/organizations";
import { PaginationParamsScheam } from "@shared/schemas/pagination";
import {
  BadRequestError,
  InternalServerError,
} from "@/lib/http/errors/http-errors";
import { HTTP } from "@/lib/http/status";
import { paginatedResponse } from "@/lib/modules/pagination/response";
import { OrganizationService } from "../services/organizations.service";

function list(context: TenantsContext) {
  return async (req: Request, res: Response) => {
    const pagination = PaginationParamsScheam.parse(req.query);
    const result = await OrganizationService.list(context.db, pagination);

    if (!result.ok) throw new InternalServerError();

    const payload = paginatedResponse({
      ...result.data,
      ...pagination,
    });

    res.status(HTTP.OK).json(payload);
  };
}

function post(context: TenantsContext) {
  return async (req: Request, res: Response) => {
    const params = OrganizationCreateSchema.parse(req.body);
    const result = await OrganizationService.create(context.db, params);

    if (!result.ok) throw new BadRequestError();

    const formatted = OrganizationResponseSchema.parse(result.data);

    res.status(HTTP.CREATED).json(formatted);
  };
}

export const OrganizationsController = {
  list,
  post,
};
