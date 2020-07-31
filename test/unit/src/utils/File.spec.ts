import FileType from '../../../../src/utils/FileType';
import {expect} from '../../../setupTests';

describe('FileType', () => {
  describe('isValidTypeForConversion()', () => {
    it('should return true when given an image', (done) => {
      const mimeType: string = 'image/png';
      const isValidTypeForConversion: boolean = FileType.isValidFileTypeForConversion(mimeType);
      expect(isValidTypeForConversion).to.be.true;
      done();
    });

    it('should return false when given a file other than an image', (done) => {
      const mimeType: string = 'text/plain';
      const isValidTypeForConversion: boolean = FileType.isValidFileTypeForConversion(mimeType);
      expect(isValidTypeForConversion).to.be.false;
      done();
    });
  });

  describe('isValidTypeForOcr()', () => {
    it('should return true for a valid file type for ocr', (done) => {
      const fileType: string = 'jpeg';
      const isValidTypeForOcr: boolean = FileType.isValidFileTypeForOcr(fileType);
      expect(isValidTypeForOcr).to.equal(true);
      done();
    });

    it('should return false for an unsupported file type', (done) => {
      const fileType: string = 'pdf';
      const isValidTypeForOcr: boolean = FileType.isValidFileTypeForOcr('pdf');
      expect(isValidTypeForOcr).to.equal(false);
      done();
    });
  });

  describe('fileType()', () => {
    it('should return the file type when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileType: string = FileType.fileType(mimeType);
      expect(fileType).to.equal('jpeg');
      done();
    });
  });

  describe('fileTypeGroup()', () => {
    it('should return the file type group when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileTypeGroup: string = FileType.fileTypeGroup(mimeType);
      expect(fileTypeGroup).to.equal('image');
      done();
    });
  });

  describe('fileTypeParts()', () => {
    it('should return the file type parts when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileTypeParts: string[] = FileType.fileTypeParts(mimeType);
      expect(fileTypeParts).to.deep.equal(['image', 'jpeg']);
      done();
    });
  });
});
