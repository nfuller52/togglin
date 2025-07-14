import type { ErrorRequestHandler } from "express";

import { HttpError } from "@/lib/http/errors/http-errors";
import { errorResponseBody } from "@/lib/http/response";

export const HttpErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof HttpError) {
    res
      .status(err.statusCode)
      .json(errorResponseBody(err.message, err.details));
  } else {
    next(err);
  }
};
