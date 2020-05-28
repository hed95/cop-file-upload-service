import IConfig from '../../interfaces/IConfig';
import IState from '../../interfaces/IState';
import IValidator from '../../interfaces/IValidator';
import IValidFileType from '../../interfaces/IValidFileType';

class FileTypeValidator implements IValidator {
  public static signature(validFileTypes: IConfig['validFileTypes'], mimetype: string): string {
    const file: Array<[string, IValidFileType]> = Object
      .entries(validFileTypes)
      .filter((type) => type[1].mimetype === mimetype);
    return file.length ? file[0][1].signature : 'invalid';
  }

  public validate(joi: any, {validFileTypes}: IConfig) {
    return {
      base: joi.binary(),
      language: {
        hex: `file type is invalid, expecting one of ${Object.keys(validFileTypes).join(', ')}`
      },
      name: 'fileType',
      rules: [{
        name: 'hex',
        validate(params: object, value: Buffer, state: IState, options: object): Buffer {
          const fileHex: string = value.toString('hex');
          const signature: string = FileTypeValidator.signature(validFileTypes, state.parent.mimetype);
          return fileHex.startsWith(signature) ? value : joi.createError('fileType.hex', {value}, state, options);
        }
      }]
    };
  }
}

export default FileTypeValidator;
