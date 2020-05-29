import { ObjectSchema } from 'joi';
import config from '../config';
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
          .keys({
            buffer: this.joi
              .fileType()
              .hex()
              .required(),
            encoding: this.joi
              .string()
              .required(),
            fieldname: this.joi
              .string()
              .required(),
            mimetype: this.joi
              .string()
              .required(),
            originalname: this.joi
              .string()
              .required(),
            size: this.joi
              .number()
              .max(config.fileSizeLimitInBytes)
              .required()
          })
          .required()
      });
  }
}

export default PostValidation;
