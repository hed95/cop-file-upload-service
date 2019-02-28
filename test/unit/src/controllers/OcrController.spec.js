import {config, expect, sinon} from '../../../setupTests';

import OcrController from '../../../../src/controllers/OcrController';

describe('OcrController', () => {
  describe('parseFile()', () => {
    let ocr;
    let req;
    let res;
    let next;

    beforeEach(() => {
      ocr = sinon.stub().returns('   some text from an image     ');
      req = {
        file: {
          version: config.fileVersions.original
        },
        logger: {
          info: sinon.spy(),
          error: sinon.spy()
        }
      };
      res = {};
      next = sinon.spy();
    });

    it('should log the correct messages, set file data call next() when a valid file type is given', (done) => {
      req.file.mimetype = 'image/jpeg';

      const ocrController = new OcrController(ocr, config);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger.info).to.have.been.calledWith('Parsed text from file');
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

    it('should log the correct messages, delete the file version and call next() when an invalid file type is given', (done) => {
      req.file.mimetype = 'application/pdf';

      const ocrController = new OcrController(ocr);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger.info).to.have.been.calledWith('File not parsed - pdf is an unsupported file type');
          expect(next).to.have.been.calledOnce;
          expect(req.file.version).to.be.undefined;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages, delete the file version and call next() when the ocr service is not available', (done) => {
      ocr = sinon.stub().returns(Promise.reject(new Error('Internal Server Error')));
      req.file.mimetype = 'image/jpeg';

      const ocrController = new OcrController(ocr);

      ocrController.parseFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Parsing file for ocr');
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith('Failed to parse text from file');
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(next).to.have.been.calledOnce;
          expect(req.file.version).to.be.undefined;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('isSupportedFileType()', () => {
    it('should return true for a supported file type', (done) => {
      const ocrController = new OcrController();
      const isSupportedFileType = ocrController.isSupportedFileType('jpeg');
      expect(isSupportedFileType).to.equal(true);
      done();
    });

    it('should return false for an unsupported file type', (done) => {
      const ocrController = new OcrController();
      const isSupportedFileType = ocrController.isSupportedFileType('pdf');
      expect(isSupportedFileType).to.equal(false);
      done();
    });
  });

  describe('getFileType()', () => {
    it('should return the file type when given a mime type', (done) => {
      const ocrController = new OcrController();
      const fileType = ocrController.getFileType('image/jpeg');
      expect(fileType).to.equal('jpeg');
      done();
    });
  });
});
