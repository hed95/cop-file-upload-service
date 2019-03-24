import { ObjectSchema } from 'joi';
import Validation from './Validation';

class DeleteValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
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

export default DeleteValidation;
