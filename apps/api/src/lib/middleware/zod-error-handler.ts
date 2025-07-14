import type { ErrorRequestHandler } from "express";

import { ZodError } from "zod";
import { errorResponseBody } from "@/lib/http/response";
import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export const ZodErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof ZodError) {
    res.status(HTTP.BAD_REQUEST).json(
      errorResponseBody(
        HTTP_TEXT.BAD_REQUEST,
        err.errors.map((error) => ({
          message: error.message,
          path: error.path,
        })),
      ),
    );
  } else {
    next(err);
  }
};
