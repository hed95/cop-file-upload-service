import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import Validation from '../validation/Validation';
import ValidationController from './ValidationController';

class GetValidationController extends ValidationController {
  private validator: Validation;

  constructor(joi: any, validator: Validation) {
    super(joi);
    this.validator = validator;
  }

  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const error: ValidationError | null = this.validate.validateFields(this.validator, this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default GetValidationController;
