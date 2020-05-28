import IConfig from './IConfig';

interface IValidator {
  validate(joi: any, config: IConfig): any;
}

export default IValidator;
