import GetValidation from '../validation/GetValidation';
import ValidationController from './ValidationController';

class GetValidationController extends ValidationController {
  validateRoute(req, res, next) {
    const error = this.validate.validateFields(new GetValidation(), this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default GetValidationController;
