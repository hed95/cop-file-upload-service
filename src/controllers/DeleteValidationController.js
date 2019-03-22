import DeleteValidation from '../validation/DeleteValidation';
import ValidationController from './ValidationController';

class DeleteValidationController extends ValidationController {
  validateRoute(req, res, next) {
    const error = this.validate.validateFields(new DeleteValidation(), this.joi, req.params);
    return this.handleValidation(req, res, next, error);
  }
}

export default DeleteValidationController;
