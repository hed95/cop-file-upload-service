import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import VirusScanController from '../../../../src/controllers/VirusScanController';
import IConfig from '../../../../src/interfaces/IConfig';
import {config, expect, fileServiceMock, nock, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('VirusScanController', () => {
  describe('scanFile()', () => {
    const fileService: any = new fileServiceMock();
    let virusScanMock: nock.Interceptor;
    let req: Request;
    let res: Response;
    let next: NextFunction;
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

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should log the correct messages and call next() if the scan passes', async () => {
      virusScanMock.reply(200, {text: 'true'});
      req.file.mimetype = 'image/jpeg';

      virusScanController = new VirusScanController(config, fileService);

      await virusScanController.scanFile(req, res, next);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith('Virus scanning file');
      expect(req.logger).to.have.been.calledWith('Virus scan passed');
      expect(next).to.have.been.calledOnce;
    });

    it('should log the correct messages and return an error if the scan fails', async () => {
      virusScanMock.reply(200, {text: 'false'});

      virusScanController = new VirusScanController(config, fileService);

      await virusScanController.scanFile(req, res, next);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith('Virus scanning file');
      expect(req.logger).to.have.been.calledWith('Virus scan failed');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: 'Virus scan failed'});
    });

    it('should log the correct messages and return an error if the virus scanner cannot be called', async () => {
      virusScanMock.reply(500, new Error('Internal Server Error'));

      virusScanController = new VirusScanController(config, fileService);

      await virusScanController.scanFile(req, res, next);

      expect(req.logger).to.have.been.calledThrice;
      expect(req.logger).to.have.been.calledWith('Virus scanning file');
      expect(req.logger).to.have.been.calledWith('Unable to call the virus scanning service');
      expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: 'Unable to call the virus scanning service'});
    });
  });
});
