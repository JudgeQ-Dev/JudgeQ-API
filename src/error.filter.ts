import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";

import { Response } from "express";

import { RequestWithSession } from "./auth/auth.middleware";

const logger = new Logger("ErrorFilter");

@Catch()
export class ErrorFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  catch(error: Error, host: ArgumentsHost) {
    const contextType = host.getType();
    let request: RequestWithSession;
    if (contextType === "http") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request = host.switchToHttp().getRequest<RequestWithSession>();
      const response = host.switchToHttp().getResponse<Response>();
      if (error instanceof HttpException)
        response.status(error.getStatus()).send(error.getResponse());
      else
        response.status(500).send({
          error: String(error),
          stack: error?.stack,
        });
    }

    if (!(error instanceof HttpException)) {
      if (error instanceof Error) {
        if (this.isIgnoredError(error)) return;

        logger.error(error.message, error.stack);
      } else logger.error(error);
    }
  }

  isIgnoredError(error: Error) {
    if (error.message.includes("Too many connections")) return true;
    if (error.message === "connect ETIMEDOUT") return true;
    if (error.message === "Connection lost: The server closed the connection.")
      return true;
    if (error.message === "read ECONNRESET") return true;

    return false;
  }
}
