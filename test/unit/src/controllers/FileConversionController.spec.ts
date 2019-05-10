import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import FileConversionController from '../../../../src/controllers/FileConversionController';
import {config, expect, fileServiceMock, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('FileConversionController', () => {
  describe('convertFile()', () => {
    const fileService: any = new fileServiceMock();
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let image: any;
    let fileConversionController: FileConversionController;

    beforeEach(() => {
      req = requestMock({
        allFiles: {original: {}},
        file: testFile,
        logger: sinon.spy()
      });
      req.file.buffer = fs.readFileSync('test/data/test-file.pdf');
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

    it('should log the correct messages and call next() if an original file can be converted', (done) => {
      fileConversionController = new FileConversionController(image, config, fileService);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledOnce;
          expect(req.logger).to.have.been.calledWith('File can be converted - application/pdf');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.have.property(config.fileVersions.clean);
          expect(req.allFiles[config.fileVersions.clean]).to.deep.equal({
            mimetype: 'image/png',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if a clean file can be converted', (done) => {
      req.allFiles.clean = testFile;
      fileConversionController = new FileConversionController(image, config, fileService);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledOnce;
          expect(req.logger).to.have.been.calledWith('File can be converted - application/pdf');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.have.property(config.fileVersions.clean);
          expect(req.allFiles[config.fileVersions.clean]).to.deep.equal({
            mimetype: 'image/png',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() if a file cannot be converted', (done) => {
      req.file.mimetype = 'text/plain';
      req.file.buffer = fs.readFileSync('test/data/test-file.txt');

      fileConversionController = new FileConversionController(image, config, fileService);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledOnce;
          expect(req.logger).to.have.been.calledWith('File cannot be converted - text/plain');
          expect(next).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error if the file conversion fails', (done) => {
      req.file.mimetype = 'application/pdf';
      image = {
        convert: () => {
          throw new Error('Internal Server Error');
        }
      };

      fileConversionController = new FileConversionController(image, config, fileService);

      fileConversionController
        .convertFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('File can be converted - application/pdf');
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
