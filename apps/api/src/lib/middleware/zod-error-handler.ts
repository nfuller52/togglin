import type { ErrorRequestHandler } from "express";

import { z, ZodError } from "zod";
import { UnprocessableEntityError } from "@/lib/http/errors/http-errors";
import { errorResponseBody } from "@/lib/http/response";
import { HTTP_TEXT } from "@/lib/http/status";

export const ZodErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof ZodError) {
    const tree = z.treeifyError(err);

    const { errors, properties } = tree as {
      errors: string[];
      properties: Record<string, { errors: string[] }>;
    };

    // Re-format Zod js/response
    if (errors[0] === "Invalid input: expected object, received undefined") {
      errors[0] = "Invalid or missing input";
    }

    return next(
      new UnprocessableEntityError(
        errorResponseBody(HTTP_TEXT.BAD_REQUEST, errors, properties),
      ),
    );
  } else {
    next(err);
  }
};
