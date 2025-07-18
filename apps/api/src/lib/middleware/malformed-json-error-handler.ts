import type { ErrorRequestHandler } from "express";

import { HttpError } from "@/lib/http/errors/http-errors";
import { HTTP } from "@/lib/http/status";

export const MalformedJsonErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next,
) => {
  if (err instanceof SyntaxError && "body" in err) {
    const error = new HttpError({
      statusCode: HTTP.BAD_REQUEST,
      body: {
        message: "Malformed JSON payload",
        errors: [err.message],
        fieldErrors: {},
      },
    });
    next(error);
  } else {
    next(err);
  }
};
