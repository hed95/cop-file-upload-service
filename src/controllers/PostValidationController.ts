import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import ValidationController from './ValidationController';

class PostValidationController extends ValidationController {
  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const {file, params}: Request = req;
    const data: IPostRequestParams = {
      businessKey: params.businessKey,
      file
    };
    const error: ValidationError | null = this.validate.validateFields(this.validator, this.joi, data);
    return this.handleValidation(req, res, next, error);
  }
}

export default PostValidationController;
