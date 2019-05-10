import {NextFunction, Request, Response} from 'express';
import OcrController from '../../../../src/controllers/OcrController';
import {config, expect, fileServiceMock, requestMock, responseMock, sinon} from '../../../setupTests';

describe('OcrController', () => {
  let ocrController: OcrController;

  describe('parseFile()', () => {
    const fileService: any = new fileServiceMock();
    let req: Request;
    let res: Response;
    let next: NextFunction;

    class OcrMockSuccess {
      public getText(): string {
        return 'some file contents';
      }
    }

    class OcrMockFailure {
      public getText(): Promise<Error> {
        return Promise.reject(new Error('Internal Server Error'));
      }
    }

    beforeEach(() => {
      req = requestMock({
        allFiles: {
          [config.fileVersions.clean]: {
            mimetype: 'image/png',
            version: config.fileVersions.original
          }
        },
        file: {
          version: config.fileVersions.original
        },
        logger: sinon.spy()
      });
      res = responseMock();
      next = sinon.spy();
    });

    it('should log the correct messages and set file data call next() when a valid image file type is given', (done) => {
      ocrController = new OcrController(config, OcrMockSuccess, OcrMockSuccess, fileService);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger).to.have.been.calledWith('Parsed text from file');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles[config.fileVersions.ocr].version).to.equal(config.fileVersions.ocr);
          expect(req.allFiles[config.fileVersions.ocr].mimetype).to.equal('text/plain');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and set file data call next() when a valid pdf file type is given', (done) => {
      req.allFiles.clean.mimetype = 'application/pdf';
      ocrController = new OcrController(config, OcrMockSuccess, OcrMockSuccess, fileService);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger).to.have.been.calledWith('Parsed text from file');
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles[config.fileVersions.ocr].version).to.equal(config.fileVersions.ocr);
          expect(req.allFiles[config.fileVersions.ocr].mimetype).to.equal('text/plain');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() when an invalid file type is given', (done) => {
      req.allFiles[config.fileVersions.clean].mimetype = 'text/html';
      ocrController = new OcrController(config, OcrMockSuccess, OcrMockSuccess, fileService);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger).to.have.been.calledWith('File not parsed - text/html is not valid for ocr');
          expect(next).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() when the ocr service is not available', (done) => {
      req.allFiles[config.fileVersions.clean].mimetype = 'image/jpeg';
      ocrController = new OcrController(config, OcrMockFailure, OcrMockFailure, fileService);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger).to.have.been.calledWith('Failed to parse text from file');
          expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
          expect(next).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
