import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // Type casting because Pino adds `id` to the request object
    const reqId = (request as any).id || 'unknown';

    this.logger.error(
      `[${reqId}] ${request.method} ${request.url} - ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
      'GlobalExceptionFilter',
    );

    let errorResponse: any;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        errorResponse = {
          ...res,
          requestId: reqId,
        };
      } else {
        errorResponse = {
          statusCode: status,
          message: res,
          requestId: reqId,
        };
      }
    } else {
      errorResponse = {
        statusCode: status,
        message: 'Internal server error',
        requestId: reqId,
      };
    }

    response.status(status).json(errorResponse);
  }
}
