import {ValidationError} from 'joi';

class Validate {
  public validateFields(rules: any, validator: any, data: object): ValidationError | null {
    const schema = rules.schema();
    const {error} = validator.validate(data, schema);
    return error;
  }
}

export default Validate;
