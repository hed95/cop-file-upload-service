import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import GetFileValidation from '../validation/GetFileValidation';
import ValidationController from './ValidationController';

class GetFileValidationController extends ValidationController {
  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const error: ValidationError | null = this.validate.validateFields(new GetFileValidation(), this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default GetFileValidationController;
