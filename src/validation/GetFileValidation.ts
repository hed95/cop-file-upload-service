import { ObjectSchema } from 'joi';
import config from '../config';
import Validation from './Validation';

class GetFileValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        businessKey: this.joi
          .string()
          .required(),
        fileVersion: this.joi
          .any()
          .valid(Object.values(config.fileVersions))
          .required(),
        filename: this.joi
          .string()
          .regex(this.filenameRegex)
          .required()
      });
  }
}

export default GetFileValidation;
