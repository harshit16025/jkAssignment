import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Request } from 'express';
import { Multer } from 'multer';

@ValidatorConstraint({ async: false })
export class IsFilePresentConstraint implements ValidatorConstraintInterface {
  validate(file: Express.Multer.File) {
    // Check if the file is present
    return file != null;
  }

  defaultMessage() {
    return 'File must be provided';
  }
}

export function IsFilePresent(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFilePresentConstraint,
    });
  };
}
