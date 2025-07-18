import type { ErrorRequestHandler } from "express";

import { HttpError } from "@/lib/http/errors/http-errors";

export const HttpErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json(err.body);
  } else {
    next(err);
  }
};
