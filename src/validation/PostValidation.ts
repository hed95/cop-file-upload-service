import { ObjectSchema } from 'joi';
import Validation from './Validation';

class PostValidation extends Validation {
  public schema(): ObjectSchema {
    return this.joi
      .object()
      .keys({
        businessKey: this.joi
          .string()
          .required(),
        file: this.joi
          .object()
          .required()
      });
  }
}

export default PostValidation;
