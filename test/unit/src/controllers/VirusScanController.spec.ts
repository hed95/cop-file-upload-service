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
        logger: sinon.spy()
      });
      req.file.buffer = fs.readFileSync('test/data/test-file.pdf');
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

    it('should log the correct messages and call next() if the scan passes - image or pdf file', (done) => {
      virusScanMock.reply(200, {text: 'true'});
      req.file.mimetype = 'image/jpeg';

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Virus scanning file');
          expect(req.logger).to.have.been.calledWith('Virus scan passed');
          expect(req.logger).to.have.been.calledWith('File can be converted - image/jpeg');
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

    it('should log the correct messages and call next() if the scan passes - text file', (done) => {
      req.file.mimetype = 'text/plain';
      req.file.buffer = fs.readFileSync('test/data/test-file.txt');

      virusScanMock.reply(200, {text: 'true'});

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Virus scanning file');
          expect(req.logger).to.have.been.calledWith('Virus scan passed');
          expect(req.logger).to.have.been.calledWith('File cannot be converted - text/plain');
          expect(next).to.have.been.calledOnce;
          expect(req.file).to.deep.equal({
            ...testFile,
            ...{
              mimetype: 'text/plain',
              version: config.fileVersions.clean
            }
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the scan fails', (done) => {
      virusScanMock.reply(200, {text: 'false'});

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Virus scanning file');
          expect(req.logger).to.have.been.calledWith('Virus scan failed');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(400);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Virus scan failed'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the virus scanner cannot be called', (done) => {
      virusScanMock.reply(500, new Error('Internal Server Error'));

      virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Virus scanning file');
          expect(req.logger).to.have.been.calledWith('Unable to call the virus scanning service');
          expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
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
