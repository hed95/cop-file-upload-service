import IRequestParams from './IRequestParams';

interface IPostRequestParams extends IRequestParams {
  file: Express.Multer.File;
}

export default IPostRequestParams;
