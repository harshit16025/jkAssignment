import { HttpStatus } from "@nestjs/common";
import { IResponse } from "../interfaces/response.interface";

export class ResponseError implements IResponse {
  constructor(infoMessage: string, data?: any, statusCode?: number) {
    this.success = false;
    this.status_code = statusCode
      ? statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;
    this.message = infoMessage;
    this.data = data;
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
  status_code: number;
}

export class ResponseSuccess implements IResponse {
  constructor(
    infoMessage: string,
    data?: any,
    statusCode?: number,
    notLog?: boolean
  ) {
    this.success = true;
    this.status_code = statusCode ? statusCode : HttpStatus.OK;
    this.message = infoMessage;
    this.data = data;
    if (!notLog) {
      try {
        var offuscateRequest = JSON.parse(JSON.stringify(data));
        if (offuscateRequest && offuscateRequest.token)
          offuscateRequest.token = "*******";
      } catch (error) {}
    }
  }
  message: string;
  data: any[];
  errorMessage: any;
  error: any;
  success: boolean;
  status_code: number;
}
