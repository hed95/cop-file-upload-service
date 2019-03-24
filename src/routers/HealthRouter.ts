import * as express from 'express';
import config from '../config';
import HealthController from '../controllers/HealthController';
import IConfig from '../interfaces/IConfig';

const {endpoints}: IConfig = config;
const healthController: HealthController = new HealthController();

class HealthRouter {
  public static router(): express.Router {
    const router: express.Router = express.Router();

    router.get(
      endpoints.health,
      healthController.healthCheck
    );

    router.get(
      endpoints.readiness,
      healthController.readinessCheck
    );

    return router;
  }
}

export default HealthRouter;
