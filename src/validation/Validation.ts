import * as Joi from 'joi';
import config from '../config';
import FileTypeValidator from '../validation/validators/FileTypeValidator';

class Validation {
  public filenamePattern: string = '([a-f0-9]{4,}-){4}[a-f0-9]{4,}';
  public filenameRegex: RegExp = new RegExp(`^${this.filenamePattern}$`);
  public joi: any = this.extendedJoi();

  public extendedJoi() {
    let extendedJoi: any = Joi;
    const validators: any = [
      new FileTypeValidator()
    ];

    validators.forEach((validator: any): any => {
      extendedJoi = extendedJoi.extend((joi: any): any => validator.validate(joi, config));
    });

    return extendedJoi;
  }
}

export default Validation;
