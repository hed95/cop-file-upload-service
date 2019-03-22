import Joi from 'joi';

class DeleteValidation {
  constructor() {
    this.filenameRegex = /^([a-f0-9]{4,}-){4}[a-f0-9]{4,}$/;
  }

  schema() {
    return Joi
      .object()
      .keys({
        processKey: Joi
          .string()
          .required(),
        filename: Joi
          .string()
          .regex(this.filenameRegex)
          .required()
      });
  }
}

export default DeleteValidation;
