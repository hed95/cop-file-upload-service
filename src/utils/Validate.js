class Validate {
  static validateFields(rules, validator, data) {
    const schema = rules.schema();
    const {error} = validator.validate(data, schema);
    return error;
  }
}

export default Validate;
