import {NextFunction, Request, Response} from 'express';
import {JoiObject, ValidationError} from 'joi';
import Validate from '../utils/Validate';

class ValidationController {
  public validate: Validate;
  protected joi: JoiObject;

  constructor(joi: any) {
    this.joi = joi;
    this.validate = new Validate();
    this.validateRoute = this.validateRoute.bind(this);
  }

  public validateRoute(req: Request, res: Response, next: NextFunction): void {
    const {logger, method}: Request = req;
    logger.error(`${method} validation is not configured`);
    return next();
  }

  public handleValidation(
    req: Request, res: Response, next: NextFunction, error: ValidationError | null
  ): Response | void {
    const {logger, method}: Request = req;

    if (error !== null) {
      logger.error(`${method} validation failed`);
      logger.error(error.details[0].message);
      return res.status(400).json({error: error.details[0].message});
    }

    logger.info(`${method} validation passed`);
    return next();
  }
}

export default ValidationController;
