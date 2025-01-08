import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
  } from '@nestjs/common';
  const fs = require("fs-extra");
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
  
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      // Check if there is an uploaded file and delete it
      const file = (request as any).file;
      console.log(file)
      if (file && file.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          }
        });
      }  
      const errorResponse = {
        status: false,
        status_code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message || null
            : 'Internal server error',
        data: {errors: exception.getResponse()}
      };
  
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        Logger.error(`${request.method} ${request.url}`, exception.stack, 'ExceptionFilter');
      } else {
        Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter');
      }
  
      response
        .status(status)
        .json(errorResponse);
    }
  }
  