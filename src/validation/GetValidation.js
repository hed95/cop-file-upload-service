import Joi from 'joi';

import config from '../config';

class GetValidation {
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
        fileVersion: Joi
          .any()
          .valid(Object.values(config.fileVersions))
          .required(),
        filename: Joi
          .string()
          .regex(this.filenameRegex)
          .required()
      });
  }
}

export default GetValidation;
