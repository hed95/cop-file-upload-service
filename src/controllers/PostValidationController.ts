import {NextFunction, Request, Response} from 'express';
import {ValidationError} from 'joi';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import PostValidation from '../validation/PostValidation';
import ValidationController from './ValidationController';

class PostValidationController extends ValidationController {
  public validateRoute(req: Request, res: Response, next: NextFunction): Response | void {
    const {file, params}: Request = req;
    const data: IPostRequestParams = {
      file,
      processKey: params.processKey
    };
    const error: ValidationError | null = this.validate.validateFields(new PostValidation(), this.joi, data);
    return this.handleValidation(req, res, next, error);
  }
}

export default PostValidationController;
