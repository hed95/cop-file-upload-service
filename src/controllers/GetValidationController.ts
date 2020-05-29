import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import ValidationController from './ValidationController';

class GetValidationController extends ValidationController {
  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const error: ValidationError | null = this.validate.validateFields(this.validator, this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default GetValidationController;
