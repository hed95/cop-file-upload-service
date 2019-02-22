import Joi from 'joi';

class PostValidation {
  schema() {
    return Joi
      .object()
      .keys({
        file: Joi.required()
      });
  }
}

export default PostValidation;
