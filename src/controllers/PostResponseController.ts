import {Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import IPostResponseParams from '../interfaces/IPostResponseParams';

class PostResponseController {
  protected config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
    this.response = this.response.bind(this);
  }

  public response(req: Request, res: Response): Response {
    const {file} = req;
    const responseParams: IPostResponseParams = {
      name: file.originalname,
      processedTime: file.processedTime,
      size: file.size,
      url: `/${this.config.fileVersions.clean}/${file.filename}`
    };
    return res.status(201).json(responseParams);
  }
}

export default PostResponseController;
