import {config, expect, nock, sinon, testFile} from '../../../setupTests';

import VirusScanController from '../../../../src/controllers/VirusScanController';

import fs from 'fs';

describe('VirusScanController', () => {
  describe('scanFile()', () => {
    let virusScanMock;
    let req;
    let res;
    let next;
    let image;

    beforeEach(() => {
      const {virusScan} = config.services;
      virusScanMock = nock(`${virusScan.url}:${virusScan.port}`).post(virusScan.path);

      req = {
        logger: {
          error: sinon.spy(),
          info: sinon.spy()
        },
        file: testFile
      };
      req.file.buffer = fs.createReadStream('test/data/test-file.txt');
      res = {
        status: () => true,
        json: () => true
      };
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

    it('should log the correct messages and call next() if the scan passes', (done) => {
      virusScanMock.reply(200, {text: 'true'});

      const virusScanController = new VirusScanController(image, config);

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
        .catch(err => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if the scan fails with an image file', (done) => {
      virusScanMock.reply(200, {text: 'false'});
      req.file.mimetype = 'image/jpeg';

      const virusScanController = new VirusScanController(image, config);

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
        .catch(err => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if the scan fails with a npn-image file', (done) => {
      virusScanMock.reply(200, {text: 'false'});
      req.file.mimetype = 'text/plain';

      const virusScanController = new VirusScanController(image, config);

      virusScanController
        .scanFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Virus scanning file');
          expect(req.logger.error).to.have.been.calledOnce;
          expect(req.logger.error).to.have.been.calledWith('Virus scan failed');
          expect(next).to.have.been.calledOnce;
          expect(req.file.version).to.equal(config.fileVersions.clean);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the scan fails', (done) => {
      virusScanMock.reply(500, new Error('Internal Server Error'));

      const virusScanController = new VirusScanController(image, config);

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
        .catch(err => {
          done(err);
        });
    });
  });
});
