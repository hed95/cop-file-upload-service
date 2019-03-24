import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import VirusScanController from '../../../../src/controllers/VirusScanController';
import IConfig from '../../../../src/interfaces/IConfig';
import {config, expect, nock, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('VirusScanController', () => {
  describe('scanFile()', () => {
    let virusScanMock: nock.Interceptor;
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let image: any;
    let virusScanController: VirusScanController;

    beforeEach(() => {
      const {virusScan}: IConfig['services'] = config.services;
      virusScanMock = nock(`http://${virusScan.host}:${virusScan.port}`).post(virusScan.path);

      req = requestMock({
        file: testFile,
        logger: {
          error: sinon.spy(),
          info: sinon.spy()
        }
      });
      req.file.buffer = new Buffer(fs.readFileSync('test/data/test-file.txt'));
      res = responseMock();
      next = sinon.spy();
      image = {
        convert: sinon.stub().returns({mimetype: 'image/tiff'})
      };

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should log the correct messages and call next() if the scan passes and the MIME type is not application/pdf', (done) => {
      virusScanMock.reply(200, {text: 'true'});

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Virus scanning file');
          expect(req.logger.info).to.have.been.calledWith('Virus scan passed');
          expect(next).to.have.been.calledOnce;
          expect(req.file.version).to.equal(config.fileVersions.clean);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if the scan passes and the MIME type is application/pdf', (done) => {
      virusScanMock.reply(200, {text: 'true'});

      req.file.mimetype = 'application/pdf';

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledThrice;
          expect(req.logger.info).to.have.been.calledWith('Virus scanning file');
          expect(req.logger.info).to.have.been.calledWith('Virus scan passed');
          expect(req.logger.info).to.have.been.calledWith('Converting pdf to an image for ocr');
          expect(next).to.have.been.calledOnce;
          expect(req.file).to.deep.equal({
            mimetype: 'image/tiff',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if the scan fails', (done) => {
      virusScanMock.reply(200, {text: 'false'});
      req.file.mimetype = 'image/jpeg';

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Virus scanning file');
          expect(req.logger.error).to.have.been.calledOnce;
          expect(req.logger.error).to.have.been.calledWith('Virus scan failed');
          expect(next).to.have.been.calledOnce;
          expect(req.file).to.deep.equal({
            mimetype: 'image/tiff',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the virus scaner cannot be called', (done) => {
      virusScanMock.reply(500, new Error('Internal Server Error'));

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Virus scanning file');
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith('Unable to call the virus scanning service');
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Unable to call the virus scanning service'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
