import { NextFunction, Request, Response } from "express";

export const OrgIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const organizationIdHeader = req.header("X-Organization-ID");

  if (organizationIdHeader && typeof organizationIdHeader === "string") {
    req.organizationId = organizationIdHeader;
  }

  next();
};
