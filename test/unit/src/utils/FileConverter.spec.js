import {config, expect, sinon} from '../../../setupTests';

import FileConverter from '../../../../src/utils/FileConverter';

describe('FileConverter', () => {
  let gm;
  let util;
  let file;

  beforeEach(() => {
    gm = sinon.stub().returns({
      toBuffer: sinon.spy()
    });
    util = {
      promisify: sinon.stub().returns(() => true)
    };
    file = {
      buffer: new Buffer('some file contents'),
      originalname: 'test-file.jpg',
      mimetype: 'image/jpeg'
    };
  });

  describe('initGm()', () => {
    it('should call gm() when given a MIME type other than application/pdf', done => {
      const fileConverter = new FileConverter(gm, util, config);
      fileConverter.initGm(file);
      expect(fileConverter.gm).to.have.been.calledOnce;
      expect(fileConverter.gm).to.have.been.calledWith(file.buffer, file.originalname);
      done();
    });
  });

  describe('fetchFileBuffer()', () => {
    it('should call gm() and util.promisify()', done => {
      const newFileType = 'png';
      const fileConverter = new FileConverter(gm, util, config);
      fileConverter.fetchFileBuffer(file, newFileType);
      expect(fileConverter.gm).to.have.been.calledOnce;
      expect(fileConverter.gm).to.have.been.calledWith(file.buffer, file.originalname);
      expect(fileConverter.util.promisify).to.have.been.calledOnce;
      done();
    });
  });

  describe('newMimeType()', () => {
    it('should return the correct MIME type when the current MIME type is image/jpeg', done => {
      const currentMimeType = 'image/jpeg';
      const originalMimeType = 'image/jpeg';
      const fileConverter = new FileConverter(gm, util, config);
      const newMimeType = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/png', 'png']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is application/pdf', done => {
      const currentMimeType = 'application/pdf';
      const originalMimeType = 'application/pdf';
      const fileConverter = new FileConverter(gm, util, config);
      const newMimeType = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/png', 'png']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is neither image/jpeg or application/pdf', done => {
      const currentMimeType = 'image/png';
      const originalMimeType = 'image/png';
      const fileConverter = new FileConverter(gm, util, config);
      const newMimeType = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpg']);
      done();
    });

    it('should return the correct MIME type when the new MIME type matches the original MIME type', done => {
      const currentMimeType = 'image/png';
      const originalMimeType = 'image/jpeg';
      const fileConverter = new FileConverter(gm, util, config);
      const newMimeType = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tif']);
      done();
    });
  });

  describe('fetchFile()', () => {
    it('should return the correct file', done => {
      const fileConverter = new FileConverter(gm, util, config);

      fileConverter.fetchFileBuffer = sinon.stub().returns(file.buffer);

      fileConverter
        .fetchFile(file)
        .then(res => {
          expect(res).to.deep.equal({mimetype: 'image/png', buffer: file.buffer});
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe('convert()', () => {
    it('should return a correctly converted file', done => {
      const logger = {
        info: sinon.spy()
      };
      const fileConverter = new FileConverter(gm, util, config);

      fileConverter.fetchFile = file => {
        if (file.mimetype === 'image/jpeg') {
          return {mimetype: 'image/png', buffer: file.buffer};
        }
        return {mimetype: 'image/tiff', buffer: file.buffer};
      };

      fileConverter
        .convert(file, logger)
        .then(res => {
          expect(logger.info).to.have.been.calledThrice;
          expect(logger.info).to.have.been.calledWith('Converting file 2 times');
          expect(logger.info).to.have.been.calledWith('File converted from image/jpeg to image/png');
          expect(logger.info).to.have.been.calledWith('File converted from image/png to image/tiff');
          expect(res).to.deep.equal({
            buffer: new Buffer('some file contents'),
            originalname: 'test-file.jpg',
            mimetype: 'image/tiff',
            originalMimeType: 'image/jpeg'
          });
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
