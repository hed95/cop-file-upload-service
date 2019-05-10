import FileType from '../../../../src/utils/FileType';
import {expect} from '../../../setupTests';

describe('FileType', () => {
  describe('isValidFileTypeForConversion', () => {
    it('should return true when given an image file', (done) => {
      const isValid = FileType.isValidFileTypeForConversion('image/png');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a pdf file', (done) => {
      const isValid = FileType.isValidFileTypeForConversion('application/pdf');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a word dopcument', (done) => {
      const isValid = FileType.isValidFileTypeForConversion('application/msword');
      expect(isValid).to.be.true;
      done();
    });

    it('should return false when given an invalid file', (done) => {
      const isValid = FileType.isValidFileTypeForConversion('text/html');
      expect(isValid).to.be.false;
      done();
    });
  });

  describe('isValidFileTypeForOcr', () => {
    it('should return true when given a png file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('png');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a jpeg file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('jpeg');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a tiff file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('tiff');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a bmp file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('bmp');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a x-portable-anymap file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('x-portable-anymap');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a pipeg file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('pipeg');
      expect(isValid).to.be.true;
      done();
    });

    it('should return true when given a pdf file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('pdf');
      expect(isValid).to.be.true;
      done();
    });

    it('should return false when given an invalid file', (done) => {
      const isValid = FileType.isValidFileTypeForOcr('html');
      expect(isValid).to.be.false;
      done();
    });
  });

  describe('fileType', () => {
    it('should return the file type when given a MIME type', (done) => {
      const fileType = FileType.fileType('image/png');
      expect(fileType).to.equal('png');
      done();
    });
  });

  describe('fileTypeParts', () => {
    it('should return the file type parts when given a MIME type', (done) => {
      const fileTypeParts = FileType.fileTypeParts('image/png');
      expect(fileTypeParts).to.deep.equal(['image', 'png']);
      done();
    });
  });
});
