import IConfig from '../../interfaces/IConfig';
import IState from '../../interfaces/IState';
import IValidator from '../../interfaces/IValidator';
import IValidFileType from '../../interfaces/IValidFileType';

class FileTypeValidator implements IValidator {
  public static validFilePropsByMime(validFileTypes: IConfig['validFileTypes'], mimetype: string): IValidFileType {
    return Object
      .entries(validFileTypes)
      .filter((type) => type[1].mimetype === mimetype)
      [0][1];
  }

  public static validFilePropsByExtension(validFileTypes: IConfig['validFileTypes'], extension: string): IValidFileType {
    return Object
      .entries(validFileTypes)
      .filter((type) => type[0] === extension)
      [0][1];
  }

  public static fileHex(value: Buffer, offset: number | undefined): string {
    const fileHex: string = value.toString('hex');
    console.log(`fileHex before = ${fileHex.substr(0, 30)}`);
    console.log(`offset = ${offset}`);
    return !offset ? fileHex : fileHex.substr(offset, fileHex.length);
  }

  public static isValidHex(value: Buffer, validFileTypes: any, fileMimeType: string): boolean {
    const {signature, offset}: IValidFileType = FileTypeValidator.validFileProps(
      validFileTypes, fileMimeType
    );
    const fileHex: string = FileTypeValidator.fileHex(value, offset);
    console.log(`fileHex after = ${fileHex.substr(0, 30)}`);
    console.log(`signature = ${signature}`);
    return fileHex.startsWith(signature);
  }

  public static isValidMimeType(validFileTypes: IConfig['validFileTypes'], fileMimeType: string): boolean {
    console.log(`fileMimeType = ${fileMimeType}`);
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
          console.log(state.parent);
          let isValidHex: boolean = FileTypeValidator.isValidHex(value, validFileTypes, state.parent.mimetype);

          if (!isValidHex) {
            const fileExtension = state.parent.originalname.split('.').pop() || '';
            isValidHex = FileTypeValidator.isValidHex(value, validFileTypes, fileExtension);
          }

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
