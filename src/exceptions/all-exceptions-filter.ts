import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

//import {BaseExceptionFilter, HTTP_SERVER_REF } from '@nestjs/core';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    console.log('[Debug][Exception] all-exception-filters', exception);

    if (host.getType() == 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus();

      let message: any = exception.message;
      const payload = exception.getResponse();
      if (!payload.hasOwnProperty('message')) {
        message = exception.getResponse() as {
          key: string;
          args: Record<string, any>;
        };
      }

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        msg: message,
      });
    } else {
      throw exception;
    }
  }
}

// @Catch(TypeORMError)
