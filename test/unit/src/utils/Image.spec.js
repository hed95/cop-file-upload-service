import {expect, sinon} from '../../../setupTests';

import Image from '../../../../src/utils/Image';

describe('Image', () => {
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

  describe('fetchFileBuffer()', () => {
    it('should call gm() and util.promisify()', done => {
      const newFileType = 'png';
      const image = new Image(gm, util);
      image.fetchFileBuffer(file, newFileType);
      expect(image.gm).to.have.been.calledOnce;
      expect(image.gm).to.have.been.calledWith(file.buffer, file.originalname);
      expect(image.util.promisify).to.have.been.calledOnce;
      done();
    });
  });

  describe('newMimeType()', () => {
    it('should return the correct MIME type when the current MIME type is image/jpeg', done => {
      const currentMimeType = 'image/jpeg';
      const originalMimeType = 'image/jpeg';
      const image = new Image(gm, util);
      const newMimeType = image.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/png', 'png']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is not image/jpeg', done => {
      const currentMimeType = 'image/png';
      const originalMimeType = 'image/png';
      const image = new Image(gm, util);
      const newMimeType = image.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpg']);
      done();
    });

    it('should return the correct MIME type when the new MIME type matches the original MIME type', done => {
      const currentMimeType = 'image/png';
      const originalMimeType = 'image/jpeg';
      const image = new Image(gm, util);
      const newMimeType = image.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tif']);
      done();
    });
  });

  describe('fetchFile()', () => {
    it('should return the correct file', done => {
      const image = new Image(gm, util);

      image.fetchFileBuffer = sinon.stub().returns(file.buffer);

      image
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
      const image = new Image(gm, util);

      image.fetchFile = file => {
        if (file.mimetype === 'image/jpeg') {
          return {mimetype: 'image/png', buffer: file.buffer};
        }
        return {mimetype: 'image/tiff', buffer: file.buffer};
      };

      image
        .convert(file, logger)
        .then(res => {
          expect(logger.info).to.have.been.calledThrice;
          expect(logger.info).to.have.been.calledWith('Converting file 2 times to remove virus');
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
