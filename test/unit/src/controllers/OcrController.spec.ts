import {NextFunction, Request, Response} from 'express';
import OcrController from '../../../../src/controllers/OcrController';
import {config, expect, requestMock, responseMock, sinon} from '../../../setupTests';

describe('OcrController', () => {
  let ocr: sinon.SinonStub;
  let ocrController: OcrController;

  describe('parseFile()', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
      ocr = sinon.stub().returns('   some text from an image     ');
      req = requestMock({
        file: {
          version: config.fileVersions.original
        },
        logger: sinon.spy()
      });
      res = responseMock();
      next = sinon.spy();
    });

    describe('should log the correct messages', () => {
      it('set file data call next() when a valid file type is given', (done) => {
        req.file.mimetype = 'image/jpeg';
        ocrController = new OcrController(ocr, config);

        ocrController.parseFile(req, res, next)
          .then(() => {
            expect(req.logger).to.have.been.calledTwice;
            expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
            expect(req.logger).to.have.been.calledWith('Parsed text from file');
            expect(next).to.have.been.calledOnce;
            expect(req.file.buffer).to.deep.equal(new Buffer('some text from an image'));
            expect(req.file.version).to.equal(config.fileVersions.ocr);
            expect(req.file.mimetype).to.equal('text/plain');
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('delete the file version and call next() when an invalid file type is given', (done) => {
        req.file.mimetype = 'application/pdf';
        ocrController = new OcrController(ocr, config);

        ocrController.parseFile(req, res, next)
          .then(() => {
            expect(req.logger).to.have.been.calledTwice;
            expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
            expect(req.logger).to.have.been.calledWith('File not parsed - pdf is an unsupported file type');
            expect(next).to.have.been.calledOnce;
            expect(req.file.version).to.be.undefined;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('delete the file version and call next() when the ocr service is not available', (done) => {
        ocr = sinon.stub().returns(Promise.reject(new Error('Internal Server Error')));
        req.file.mimetype = 'image/jpeg';
        ocrController = new OcrController(ocr, config);

        ocrController.parseFile(req, res, next)
          .then(() => {
            expect(req.logger).to.have.been.calledThrice;
            expect(req.logger).to.have.been.calledWith('Parsing file for ocr');
            expect(req.logger).to.have.been.calledWith('Failed to parse text from file');
            expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
            expect(next).to.have.been.calledOnce;
            expect(req.file.version).to.be.undefined;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
