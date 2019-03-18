import Validate from '../utils/Validate';

class ValidationController {
  constructor(joi) {
    this.joi = joi;
    this.validate = Validate;
    this.validateRoute = this.validateRoute.bind(this);
  }

  validateRoute(req, res, next) {
    const {logger, method} = req;
    logger.error(`${method} validation is not configured`);
    next();
  }

  handleValidation(req, res, next, error) {
    const {logger, method} = req;

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
