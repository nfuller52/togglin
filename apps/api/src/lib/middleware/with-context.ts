import type { AppContext } from "@/lib/modules/types";
import type { ErrorRequestHandler, RequestHandler } from "express";

export function withContext(
  context: AppContext,
  middleware: (context: AppContext) => RequestHandler | ErrorRequestHandler,
) {
  return middleware(context);
}
