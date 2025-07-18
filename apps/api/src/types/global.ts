import "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      organizationId?: string;
    }

    interface Response {
      responseTime?: number;
    }
  }
}
