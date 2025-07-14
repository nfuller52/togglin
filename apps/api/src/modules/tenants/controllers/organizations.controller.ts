import type { Request, Response } from "express";
import type { TenantsContext } from "../types";

import { PaginationParamsScheam } from "@lib/modules/pagination/schema";
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

export const OrganizationsController = {
  list,
};
