import { ObjectSchema } from 'joi';
import config from '../config';
import Validation from './Validation';

class GetValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        fileVersion: this.joi
          .any()
          .valid(Object.values(config.fileVersions))
          .required(),
        filename: this.joi
          .string()
          .regex(this.filenameRegex)
          .required(),
        processKey: this.joi
          .string()
          .required()
      });
  }
}

export default GetValidation;
