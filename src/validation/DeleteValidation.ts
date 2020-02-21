import { ObjectSchema } from 'joi';
import Validation from './Validation';

class DeleteValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        businessKey: this.joi
          .string()
          .required(),
        fileVersion: this.joi
          .string()
          .required(),
        filename: this.joi
          .string()
          .regex(this.filenameRegex)
          .required()
      });
  }
}

export default DeleteValidation;
