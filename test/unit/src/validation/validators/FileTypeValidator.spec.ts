import * as fs from 'fs';
import * as joi from 'joi';
import IState from '../../../../../src/interfaces/IState';
import FileTypeValidator from '../../../../../src/validation/validators/FileTypeValidator';
import {config, expect, testFile} from '../../../../setupTests';

describe('FileTypeValidator', () => {
  describe('signature()', () => {
    it('should return the correct signature when the file type is valid', (done) => {
      const mimetype: string = 'application/pdf';
      const signature = FileTypeValidator.signature(config.validFileTypes, mimetype);
      expect(signature).to.equal(config.validFileTypes.pdf.signature);
      done();
    });

    it('should return invalid when the file type is invalid', (done) => {
      const mimetype: string = 'text/plain';
      const signature = FileTypeValidator.signature(config.validFileTypes, mimetype);
      expect(signature).to.equal('invalid');
      done();
    });
  });

  describe('validate()', () => {
    it('should return the correct params for the validator', (done) => {
      const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
      const validator = fileTypeValidator.validate(joi, config);
      expect(validator).to.have.property('language').and.to.deep.equal({
        hex: `file type is invalid, expecting one of ${Object.keys(config.validFileTypes).join(', ')}`
      });
      expect(validator).to.have.property('name').and.to.equal('fileType');
      expect(validator).to.have.property('rules');
      expect(validator.rules.length).to.equal(1);
      expect(validator.rules[0]).to.have.property('name').and.to.equal('hex');
      done();
    });

    describe('rules.validate()', () => {
      const file: Buffer = fs.readFileSync('test/data/test-file.pdf');
      const params: object = {};
      const value: Buffer = file;
      const state: IState = {
        key: '',
        parent: {...testFile, ...{mimetype: 'application/pdf'}},
        path: [],
        reference: ''
      };
      const options: object = {};

      it('should return the value when the file is valid', (done) => {
        const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
        const validator = fileTypeValidator.validate(joi, config);
        const isValid = validator.rules[0].validate(params, value, state, options);
        expect(isValid).to.deep.equal(file);
        done();
      });

      it('should return a joi error object when the file is invalid', (done) => {
        state.parent.mimetype = 'text/plain';
        const fileTypeValidator: FileTypeValidator = new FileTypeValidator();
        const validator = fileTypeValidator.validate(joi, config);
        const isValid = validator.rules[0].validate(params, value, state, options);
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
  });
});
