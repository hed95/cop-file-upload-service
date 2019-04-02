import * as express from 'express';
import * as gm from 'gm';
import * as joi from 'joi';
import * as multer from 'multer';
import * as ocr from 'tesseractocr';
import * as util from 'util';
import config from '../config';
import DeleteValidationController from '../controllers/DeleteValidationController';
import GetValidationController from '../controllers/GetValidationController';
import MetadataController from '../controllers/MetadataController';
import OcrController from '../controllers/OcrController';
import PostResponseController from '../controllers/PostResponseController';
import PostValidationController from '../controllers/PostValidationController';
import StorageController from '../controllers/StorageController';
import VirusScanController from '../controllers/VirusScanController';
import S3Service from '../services/S3Service';
import FileConverter from '../utils/FileConverter';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Instance = multer({storage});
const s3Service: S3Service = new S3Service(config, util);
const storageController: StorageController = new StorageController(s3Service, config);

class FilesRouter {
  public static router(): express.Router {
    const router: express.Router = express.Router();

    router.get(
      `${config.endpoints.files}/:processKey/:fileVersion/:filename`,
      new GetValidationController(joi).validateRoute,
      storageController.downloadFile
    );

    router.post(
      `${config.endpoints.files}/:processKey`,
      upload.single('file'),
      new PostValidationController(joi).validateRoute,
      new MetadataController(Date.now()).generateMetadata,
      storageController.uploadFile,
      new VirusScanController(new FileConverter(gm, util, config), config).scanFile,
      storageController.uploadFile,
      new OcrController(ocr, config).parseFile,
      storageController.uploadFile,
      new PostResponseController(config).response
    );

    router.delete(
      `${config.endpoints.files}/:processKey/:filename`,
      new DeleteValidationController(joi).validateRoute,
      storageController.deleteFiles
    );

    return router;
  }
}

export default FilesRouter;
