import type { ErrorRequestHandler } from "express";

import { z, ZodError } from "zod";
import { errorResponseBody } from "@/lib/http/response";
import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export const ZodErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof ZodError) {
    const tree = z.treeifyError(err);

    const { errors, properties } = tree as {
      errors: string[];
      properties: Record<string, { errors: string[] }>;
    };

    res
      .status(HTTP.BAD_REQUEST)
      .json(errorResponseBody(HTTP_TEXT.BAD_REQUEST, errors, properties));
  } else {
    next(err);
  }
};
