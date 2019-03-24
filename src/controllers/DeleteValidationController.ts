import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import DeleteValidation from '../validation/DeleteValidation';
import ValidationController from './ValidationController';

class DeleteValidationController extends ValidationController {
  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const error: ValidationError | null = this.validate.validateFields(new DeleteValidation(), this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default DeleteValidationController;
