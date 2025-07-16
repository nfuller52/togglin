import type { Request, Response } from "express";
import type { TenantsContext } from "../types";

import {
  OrganizationCreateSchema,
  OrganizationResponseSchema,
} from "@shared/schemas/organizations";
import { PaginationParamsScheam } from "@shared/schemas/pagination";
import { HTTP } from "@/lib/http/status";
import { paginatedResponse } from "@/lib/modules/pagination/response";
import { OrganizationService } from "../services/organizations.service";

function list(context: TenantsContext) {
  return async (req: Request, res: Response) => {
    const pagination = PaginationParamsScheam.parse(req.query);

    const { data, total } = await OrganizationService.list(
      context.db,
      pagination,
    );
    const result = paginatedResponse({ data, total, ...pagination });

    res.status(HTTP.OK).json(result);
  };
}

function post(context: TenantsContext) {
  return async (req: Request, res: Response) => {
    const organization = await OrganizationService.create(
      context.db,
      OrganizationCreateSchema.parse(req.body),
    );

    const formattedOrg = OrganizationResponseSchema.parse(organization);

    res.status(HTTP.CREATED).json(formattedOrg);
  };
}

export const OrganizationsController = {
  list,
  post,
};
