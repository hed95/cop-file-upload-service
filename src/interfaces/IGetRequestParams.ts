import IRequestParams from './IRequestParams';

interface IGetRequestParams extends IRequestParams {
  fileVersion: string;
  filename: string;
}

export default IGetRequestParams;
