import Joi from 'joi';

class PostValidation {
  schema() {
    return Joi
      .object()
      .keys({
        file: Joi
          .object()
          .required(),
        processKey: Joi
          .string()
          .required()
      });
  }
}

export default PostValidation;
