import {createLogger, format, transports} from 'winston';

import FilesRoutes from './routes/FilesRoutes';
import Keycloak from 'keycloak-connect';
import Logger from './utils/Logger';

import config from './config';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

const {port, services} = config;
const logger = new Logger(createLogger, format, transports).logger();
const app = express();

if (!['dev', 'test'].includes(process.env.NODE_ENV)) {
  const keycloak = new Keycloak({}, services.keycloak);
  app.use(keycloak.middleware());
  app.use('*', keycloak.protect());
}

app.use(helmet());

app.use((req, res, next) => {
  req.logger = logger;
  next();
});

app.use((req, res, next) => {
  const {logger, method, originalUrl} = req;
  logger.info(`${method} request for ${originalUrl}`);
  next();
});

app.use(FilesRoutes);

const server = http
  .createServer(app)
  .listen(port, () => logger.info(`Listening on port ${port}`));

app.use((req, res) => {
  req.logger.error('Route not found');
  res.status(404).json({error: 'Route not found'});
});

export default server;