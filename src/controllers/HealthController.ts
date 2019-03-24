import {Request, Response} from 'express';

class HealthController {
  public healthCheck(req: Request, res: Response): Response {
    return res.status(200).json({status: 'OK'});
  }

  public readinessCheck(req: Request, res: Response): Response {
    return res.status(200).json({ready: true});
  }
}

export default HealthController;
