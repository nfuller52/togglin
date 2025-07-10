import pino from "pino";
import { app } from "@/configs/app";

export const logger = pino({
  name: "api",
  level: app.env.LOG_LEVEL,
  transport:
    app.env.NODE_ENV === "local"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname,reqId,req,res,responseTime",
          },
        }
      : undefined,
});
