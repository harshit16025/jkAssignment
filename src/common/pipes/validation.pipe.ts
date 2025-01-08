import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      const error = this.formatErrors(errors);
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Format the errors.
   *
   * @param {any[]} errors
   */
  private formatErrors(errors: any[]) {
    const output = {};
    errors.forEach(async err => {
      if (err.children.length == 0) {
        for (const property in err.constraints) {
          const message = err.constraints[property];
          output[err.property] = this.capitalizeWord(message);
        }
      } else {
        for (const x in err.children) {
          const message = `${err.property} is not valid`;
          output[err.property] = this.capitalizeWord(message);
        }
      }
    });
    return output;
  }

  /**
   *
   * @param strinng
   */
  private capitalizeWord(strinng) {
    let i,
      frags = strinng.split('_');
    for (i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }
}