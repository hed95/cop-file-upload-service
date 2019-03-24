import * as Joi from 'joi';

class Validation {
  public filenameRegex: RegExp = /^([a-f0-9]{4,}-){4}[a-f0-9]{4,}$/;
  protected joi = Joi;
}

export default Validation;
