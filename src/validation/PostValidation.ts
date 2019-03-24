import { ObjectSchema } from 'joi';
import Validation from './Validation';

class PostValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        file: this.joi
          .object()
          .required(),
        processKey: this.joi
          .string()
          .required()
      });
  }
}

export default PostValidation;
