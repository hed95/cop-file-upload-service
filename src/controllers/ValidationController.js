import Joi from 'joi';
import PostValidation from '../validation/PostValidation';

class ValidationController {
  validatePost(req, res, next) {
    const {body, file, logger, method} = req;
    const schema = new PostValidation().schema();
    const dataToValidate = {
      file: file,
      processKey: body.processKey
    };
    const result = Joi.validate(dataToValidate, schema);
    const {error} = result;

    if (error !== null) {
      logger.error(`${method} validation failed`);
      logger.error(error.details[0].message);
      return res.status(400).json({error: error.details[0].message});
    }

    logger.info(`${method} validation passed`);
    next();
  }
}

export default ValidationController;
