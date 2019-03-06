import {createLogger, format, transports} from 'winston';

import FilesRoutes from './src/routes/FilesRoutes';
import Logger from './src/utils/Logger';

import config from './src/config';
import express from 'express';
import helmet from 'helmet';
import http from 'http';

const {port} = config;
const app = express();
const logger = new Logger(createLogger, format, transports).logger();

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
