import PostValidation from '../validation/PostValidation';
import ValidationController from './ValidationController';

class PostValidationController extends ValidationController {
  validateRoute(req, res, next) {
    const {body, file} = req;
    const data = {
      file: file,
      processKey: body.processKey
    };
    const error = this.validate.validateFields(new PostValidation(), this.joi, data);
    return this.handleValidation(req, res, next, error);
  }
}

export default PostValidationController;
