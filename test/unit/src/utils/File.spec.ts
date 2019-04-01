import File from '../../../../src/utils/FileType';
import {expect} from '../../../setupTests';

describe('File', () => {
  describe('isValidTypeForConversion()', () => {
    it('should return true when given an image', (done) => {
      const mimeType: string = 'image/png';
      const isValidTypeForConversion: boolean = File.isValidFileTypeForConversion(mimeType);
      expect(isValidTypeForConversion).to.be.true;
      done();
    });

    it('should return true when given a pdf', (done) => {
      const mimeType: string = 'application/pdf';
      const isValidTypeForConversion: boolean = File.isValidFileTypeForConversion(mimeType);
      expect(isValidTypeForConversion).to.be.true;
      done();
    });

    it('should return true when given a file other than an image or pdf', (done) => {
      const mimeType: string = 'text/plain';
      const isValidTypeForConversion: boolean = File.isValidFileTypeForConversion(mimeType);
      expect(isValidTypeForConversion).to.be.false;
      done();
    });
  });

  describe('isValidTypeForOcr()', () => {
    it('should return true for a valid file type for ocr', (done) => {
      const fileType: string = 'jpeg';
      const isValidTypeForOcr: boolean = File.isValidFileTypeForOcr(fileType);
      expect(isValidTypeForOcr).to.equal(true);
      done();
    });

    it('should return false for an unsupported file type', (done) => {
      const fileType: string = 'pdf';
      const isValidTypeForOcr: boolean = File.isValidFileTypeForOcr('pdf');
      expect(isValidTypeForOcr).to.equal(false);
      done();
    });
  });

  describe('fileType()', () => {
    it('should return the file type when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileType: string = File.fileType(mimeType);
      expect(fileType).to.equal('jpeg');
      done();
    });
  });

  describe('fileTypeGroup()', () => {
    it('should return the file type group when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileTypeGroup: string = File.fileTypeGroup(mimeType);
      expect(fileTypeGroup).to.equal('image');
      done();
    });
  });

  describe('fileTypeParts()', () => {
    it('should return the file type parts when given a mime type', (done) => {
      const mimeType: string = 'image/jpeg';
      const fileTypeParts: string[] = File.fileTypeParts(mimeType);
      expect(fileTypeParts).to.deep.equal(['image', 'jpeg']);
      done();
    });
  });
});
