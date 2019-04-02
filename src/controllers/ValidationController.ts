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
    logger(`${method} validation is not configured`, 'error');
    return next();
  }

  public handleValidation(
    req: Request, res: Response, next: NextFunction, error: ValidationError | null
  ): Response | void {
    const {logger, method}: Request = req;

    if (error !== null) {
      logger(`${method} validation failed`, 'error');
      logger(error.details[0].message, 'error');
      return res.status(400).json({error: error.details[0].message});
    }

    logger(`${method} validation passed`);
    return next();
  }
}

export default ValidationController;
