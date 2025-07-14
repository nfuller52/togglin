import type { AppContext } from "@/lib/modules/types";
import type { ErrorRequestHandler } from "express";

import { errorResponseBody } from "@/lib/http/response";
import { HTTP, HTTP_TEXT } from "@/lib/http/status";

export function InternalErrorHandler(context: AppContext) {
  const handler: ErrorRequestHandler = (
    err,
    _req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next,
  ) => {
    context.logger.error(err);

    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json(errorResponseBody(HTTP_TEXT.INTERNAL_SERVER_ERROR));
  };

  return handler;
}
