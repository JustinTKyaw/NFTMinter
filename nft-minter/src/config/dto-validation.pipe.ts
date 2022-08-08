import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  private readonly logger = new Logger(DtoValidationPipe.name);
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      errors.forEach((e) => {
        this.logger.error(JSON.stringify(e.constraints));
      });
      let errObj = errors[0].constraints;
      let errorMessage = errObj[Object.keys(errObj)[0]];
      throw new BadRequestException(errorMessage);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
