import * as cors from 'cors';
import * as express from 'express';
import {Express} from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as Keycloak from 'keycloak-connect';
import * as uuid from 'uuid/v4';
import * as winston from 'winston';
import {createLogger, format, transports} from 'winston';
import config from './config';
import IConfig from './interfaces/IConfig';
import FilesRouter from './routers/FilesRouter';
import HealthRouter from './routers/HealthRouter';
import Environment from './utils/Environment';
import Logger from './utils/Logger';
import LogMessage from './utils/LogMessage';

const {endpoints, port, services}: IConfig = config;
const logger: winston.Logger = new Logger(createLogger, format, transports).logger();
const app: Express = express();

const corsConfiguration = {
  methods: ['DELETE', 'GET', 'PUT', 'PATCH', 'POST', 'OPTIONS'],
  origin: '*'
};
app.use(cors(corsConfiguration));
app.options('*', cors(corsConfiguration));

logger.info(`Request in ${process.env.NODE_ENV} env`);

if (Environment.isProd(process.env.NODE_ENV)) {
  logger.info('Checking auth token');
  const keycloak: Keycloak = new Keycloak({}, services.keycloak);
  app.use(keycloak.middleware());
  app.use(endpoints.files, keycloak.protect());
  logger.info('Auth token valid');
}

app.use(helmet());

app.use((req, res, next) => {
  req.uuid = uuid();
  next();
});

app.use((req, res, next) => {
  const email: string = req.kauth && req.kauth.grant && req.kauth.grant.access_token.content.email;
  req.logger = (message: string, level: string): void => {
    logger.log(LogMessage.create({email, filename: req.uuid, message, level}));
  };
  next();
});

app.use((req, res, next) => {
  req.logger(`${req.method} request for ${req.originalUrl}`);
  next();
});

app.use(FilesRouter.router());
app.use(HealthRouter.router());

app.use((req, res) => {
  req.logger('Route not found', 'error');
  res.status(404).json({error: 'Route not found'});
});

const server: http.Server = http
  .createServer(app)
  .listen(port, () => logger.info(`Listening on port ${port}`));

export default server;
