import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  
  @Injectable()
  export class TrimPipe implements PipeTransform<any> {
    async transform(value: any,  metadata : ArgumentMetadata) {
      if (this.isObj(value)) {
        
        return this.trim(value)
      }
      return value;
    }
  
    private isObj(obj: any): boolean {
      return typeof obj === 'object' && obj !== null
    }
  
    private trim(values) {
      Object.keys(values).forEach(key => {
          if (this.isObj(values[key])) {
            values[key] = this.trim(values[key])
          } else {
            if (typeof values[key] === 'string') {
              values[key] = values[key].trim()
            }
          }
      })
      return values
    }
  }
  