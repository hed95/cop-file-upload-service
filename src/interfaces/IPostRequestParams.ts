import IRequestParams from './IRequestParams';

interface IPostRequestParams extends IRequestParams {
  file: Express.Multer.File;
  email: string;
}

export default IPostRequestParams;
