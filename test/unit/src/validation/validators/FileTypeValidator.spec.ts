import * as fs from 'fs';
import * as Joi from 'joi';
import IState from '../../../../../src/interfaces/IState';
import FileTypeValidator from '../../../../../src/validation/validators/FileTypeValidator';
import {config, expect, testFile} from '../../../../setupTests';

describe('FileTypeValidator', () => {
  describe('validFileProps()', () => {
    it('should return the correct file props', (done) => {
      const mimetype: string = 'application/pdf';
      const validFileProps = FileTypeValidator.validFileProps(config.validFileTypes, mimetype);
      expect(validFileProps).to.equal(config.validFileTypes.pdf);
      done();
    });
  });

  describe('fileHex()', () => {
    const file: Buffer = fs.readFileSync('test/data/test-file.pdf');
    const fileHexString: string = file.toString('hex');
    const offset: number = 8;
    const offsetFileHexString: string = fileHexString.substr(offset, fileHexString.length);

    it('should return the correct file hex signature when an offset is given', (done) => {
      const fileHex = FileTypeValidator.fileHex(file, offset);
      expect(fileHex).to.equal(offsetFileHexString);
      done();
    });

    it('should return the correct file hex signature when no offset is given', (done) => {
      const fileHex = FileTypeValidator.fileHex(file, undefined);
      expect(fileHex).to.equal(fileHexString);
      done();
    });
  });

  describe('isValidHex()', () => {
    const fileHex: string = '255044462d312e330a25c4e5f2e5eba7f3';

    it('should return true when the file hex is valid', (done) => {
      const signature: string = '25504446';
      const isValidHex: boolean = FileTypeValidator.isValidHex(fileHex, signature);
      expect(isValidHex).to.be.true;
      done();
    });

    it('should return false when the file hex is invalid', (done) => {
      const signature: string = '504b0304';
      const isValidHex: boolean = FileTypeValidator.isValidHex(fileHex, signature);
      expect(isValidHex).to.be.false;
      done();
    });
  });

  describe('isValidMimeType()', () => {
    it('should return true when the mime type is valid', (done) => {
      const mimeType: string = 'application/pdf';
      const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(config.validFileTypes, mimeType);
      expect(isValidMimeType).to.be.true;
      done();
    });

    it('should return false when the mime type is invalid', (done) => {
      const mimeType: string = 'text/plain';
      const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(config.validFileTypes, mimeType);
      expect(isValidMimeType).to.be.false;
      done();
    });
  });

  describe('validate()', () => {
    it('should return the correct params for the validator', (done) => {
      const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
      const validator = fileTypeValidator.validate(Joi, config);
      expect(validator).to.have.property('language').and.to.deep.equal({
        hex: `file type is invalid (hex), valid formats are: ${Object.keys(config.validFileTypes).join(', ')}`,
        mime: `file type is invalid (mime), valid formats are: ${Object.keys(config.validFileTypes).join(', ')}`
      });
      expect(validator).to.have.property('name').and.to.equal('fileType');
      expect(validator).to.have.property('rules');
      expect(validator.rules.length).to.equal(2);
      expect(validator.rules[0]).to.have.property('name').and.to.equal('hex');
      expect(validator.rules[1]).to.have.property('name').and.to.equal('mime');
      done();
    });

    describe('rules.validate()', () => {
      let file: Buffer = fs.readFileSync('test/data/test-file.pdf');
      const params: object = {};
      const state: IState = {
        key: '',
        parent: {...testFile, ...{mimetype: 'application/pdf'}},
        path: [],
        reference: ''
      };
      const options: object = {};

      describe('hex', () => {
        it('should return the value when the file is valid', (done) => {
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[0].validate(params, file, state, options);
          expect(isValid).to.deep.equal(file);
          done();
        });

        it('should return a joi error object when the file is invalid', (done) => {
          file = fs.readFileSync('test/data/invalid-file-with-valid-ext.pdf');
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[0].validate(params, file, state, options);
          expect(isValid).to.deep.equal({
            context: {
              key: undefined,
              label: '',
              value: file
            },
            flags: {},
            isJoi: true,
            message: undefined,
            options: {},
            path: [],
            template: undefined,
            type: 'fileType.hex'
          });
          done();
        });
      });

      describe('mime', () => {
        it('should return the value when the file is valid', (done) => {
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[1].validate(params, file, state, options);
          expect(isValid).to.deep.equal(file);
          done();
        });

        it('should return a joi error object when the file is invalid', (done) => {
          state.parent.mimetype = 'text/plain';
          const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
          const validator = fileTypeValidator.validate(Joi, config);
          const isValid = validator.rules[1].validate(params, file, state, options);
          expect(isValid).to.deep.equal({
            context: {
              key: undefined,
              label: '',
              value: file
            },
            flags: {},
            isJoi: true,
            message: undefined,
            options: {},
            path: [],
            template: undefined,
            type: 'fileType.mime'
          });
          done();
        });
      });
    });
  });
});
