import type { Request, Response } from "express";

import { nanoid } from "nanoid";
import { pinoHttp } from "pino-http";
import { logger } from "./logger";

const customMessage = (req: Request, res: Response) => {
  return `[${res.statusCode}] ${req.method} ${req.originalUrl}`;
};

export const httpLogger = pinoHttp({
  logger,
  genReqId(req) {
    return req.headers["x-request-id"]?.toString() ?? nanoid();
  },
  customLogLevel(_req: Request, res: Response, err) {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: customMessage,
  customErrorMessage: customMessage,
  serializers: {
    req: (req) => {
      return {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
      };
    },
    res: (res) => {
      return {
        status: res.statusCode,
      };
    },
  },
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "res.body.password",
    ],
    censor: "[REDACTED]",
  },
});
