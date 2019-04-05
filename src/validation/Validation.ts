import * as Joi from 'joi';

class Validation {
  public filenamePattern: string = '([a-f0-9]{4,}-){4}[a-f0-9]{4,}';
  public filenameRegex: RegExp = new RegExp(`^${this.filenamePattern}$`);
  protected joi: any = Joi;
}

export default Validation;
