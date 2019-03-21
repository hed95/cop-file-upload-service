import HealthController from '../controllers/HealthController';

import config from '../config';
import express from 'express';

const {endpoints} = config;
const healthController = new HealthController();

class HealthRouter {
  static router() {
    const router = express.Router();

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
