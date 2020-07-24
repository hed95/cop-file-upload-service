import IConfig from '../../interfaces/IConfig';
import IState from '../../interfaces/IState';
import IValidator from '../../interfaces/IValidator';
import IValidFileType from '../../interfaces/IValidFileType';

class FileTypeValidator implements IValidator {
  public static validFileProps(validFileTypes: IConfig['validFileTypes'], mimetype: string): IValidFileType {
    return Object
      .entries(validFileTypes)
      .filter((type) => type[1].mimetype === mimetype)
      [0][1];
  }

  public static fileHex(value: Buffer, offset: number | undefined): string {
    const fileHex: string = value.toString('hex');
    return !offset ? fileHex : fileHex.substr(offset, fileHex.length);
  }

  public static isValidHex(fileHex: string, signature: string): boolean {
    return fileHex.startsWith(signature);
  }

  public static isValidMimeType(validFileTypes: IConfig['validFileTypes'], fileMimeType: string): boolean {
    return Object.entries(validFileTypes).some(([, {mimetype}]) => fileMimeType === mimetype);
  }

  public validate(joi: any, {validFileTypes}: IConfig) {
    return {
      base: joi.binary(),
      language: {
        hex: `file type is invalid (hex), valid formats are: ${Object.keys(validFileTypes).join(', ')}`,
        mime: `file type is invalid (mime), valid formats are: ${Object.keys(validFileTypes).join(', ')}`
      },
      name: 'fileType',
      rules: [{
        name: 'hex',
        validate(params: object, value: Buffer, state: IState, options: object): any {
          const {signature, offset}: IValidFileType = FileTypeValidator.validFileProps(
            validFileTypes, state.parent.mimetype
          );
          const fileHex: string = FileTypeValidator.fileHex(value, offset);
          const isValidHex = FileTypeValidator.isValidHex(fileHex, signature);
          return isValidHex ? value : joi.createError('fileType.hex', {value}, state, options);
        }
      }, {
        name: 'mime',
        validate(params: object, value: Buffer, state: IState, options: object): any {
          const isValidMimeType: boolean = FileTypeValidator.isValidMimeType(validFileTypes, state.parent.mimetype);
          return isValidMimeType ? value : joi.createError('fileType.mime', {value}, state, options);
        }
      }]
    };
  }
}

export default FileTypeValidator;
