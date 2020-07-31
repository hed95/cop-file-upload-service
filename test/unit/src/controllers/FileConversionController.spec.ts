import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import FileConversionController from '../../../../src/controllers/FileConversionController';
import {config, expect, requestMock, responseMock, sinon} from '../../../setupTests';

describe('FileConversionController', () => {
  describe('convertFile()', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let image: any;
    let fileConversionController: FileConversionController;

    beforeEach(() => {
      req = requestMock({
        file: {
          buffer: fs.readFileSync('test/data/test-file.png'),
          mimetype: 'image/png'
        },
        logger: sinon.spy()
      });
      res = responseMock();
      next = sinon.spy();
      image = {
        convert: sinon.stub().returns({
          buffer: new Buffer('some file contents'),
          mimetype: 'image/png',
          version: config.fileVersions.clean
        })
      };

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);
    });

    it('should log the correct messages and call next() if the file can be converted - image and req.allFiles does not exist', (done) => {
      fileConversionController = new FileConversionController(image, config);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledOnce;
          expect(req.logger).to.have.been.calledWith('File can be converted - image/png');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.have.property(config.fileVersions.clean);
          expect(req.allFiles[config.fileVersions.clean]).to.deep.equal({
            buffer: new Buffer('some file contents'),
            mimetype: 'image/png',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should set req.allFiles correctly when req.allFiles exists', (done) => {
      req.allFiles = {
        orig: {}
      };

      fileConversionController = new FileConversionController(image, config);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.allFiles).to.have.property(config.fileVersions.clean);
          expect(req.allFiles).to.deep.equal({
            clean: {
              buffer: new Buffer('some file contents'),
              mimetype: 'image/png',
              version: config.fileVersions.clean
            },
            orig: {}
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if the file is not valid for conversion - text file', (done) => {
      const buffer = fs.readFileSync('test/data/test-file.txt');
      const mimetype = 'text/plain';
      req.file.buffer = buffer;
      req.file.mimetype = mimetype;

      fileConversionController = new FileConversionController(image, config);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledOnce;
          expect(req.logger).to.have.been.calledWith('File not valid for conversion - text/plain');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.have.property(config.fileVersions.clean);
          expect(req.allFiles[config.fileVersions.clean]).to.deep.equal({
            buffer,
            mimetype,
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the file conversion fails', (done) => {
      image = {
        convert: () => {
          throw new Error('Internal Server Error');
        }
      };

      fileConversionController = new FileConversionController(image, config);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('File can be converted - image/png');
          expect(req.logger).to.have.been.calledWith('Unable to convert file', 'error');
          expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Unable to convert file'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
