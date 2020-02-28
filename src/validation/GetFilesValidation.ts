import { ObjectSchema } from 'joi';
import Validation from './Validation';

class GetFilesValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        businessKey: this.joi
          .string()
          .required()
      });
  }
}

export default GetFilesValidation;
