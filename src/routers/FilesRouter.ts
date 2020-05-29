import * as express from 'express';
import * as gm from 'gm';
import * as Joi from 'joi';
import * as multer from 'multer';
import * as ocr from 'tesseractocr';
import * as util from 'util';
import config from '../config';
import DeleteValidationController from '../controllers/DeleteValidationController';
import FileConversionController from '../controllers/FileConversionController';
import GetValidationController from '../controllers/GetValidationController';
import MetadataController from '../controllers/MetadataController';
import OcrController from '../controllers/OcrController';
import PostResponseController from '../controllers/PostResponseController';
import PostValidationController from '../controllers/PostValidationController';
import StorageController from '../controllers/StorageController';
import VirusScanController from '../controllers/VirusScanController';
import S3Service from '../services/S3Service';
import FileConverter from '../utils/FileConverter';
import DeleteValidation from '../validation/DeleteValidation';
import GetFilesValidation from '../validation/GetFilesValidation';
import GetFileValidation from '../validation/GetFileValidation';
import PostValidation from '../validation/PostValidation';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Instance = multer({storage});
const s3Service: S3Service = new S3Service(config, util);
const storageController: StorageController = new StorageController(s3Service, config);

class FilesRouter {
  public static router(): express.Router {
    const router: express.Router = express.Router();

    router.get(
      `${config.endpoints.files}/:businessKey/:fileVersion/:filename`,
      new GetValidationController(Joi, new GetFileValidation()).validateRoute,
      storageController.downloadFile
    );

    router.get(
      `${config.endpoints.files}/:businessKey`,
      new GetValidationController(Joi, new GetFilesValidation()).validateRoute,
      storageController.listFiles
    );

    router.post(
      `${config.endpoints.files}/:businessKey`,
      upload.single('file'),
      new PostValidationController(Joi, new PostValidation()).validateRoute,
      new MetadataController(Date.now(), config).generateMetadata,
      storageController.uploadFile,
      new VirusScanController(config).scanFile,
      new FileConversionController(new FileConverter(gm, util, config), config).convertFile,
      new OcrController(ocr, config).parseFile,
      new FileConversionController(new FileConverter(gm, util, config), config).convertFile,
      storageController.uploadFile,
      storageController.uploadFile,
      new PostResponseController(config).response
    );

    router.delete(
      `${config.endpoints.files}/:businessKey/:fileVersion/:filename`,
      new DeleteValidationController(Joi, new DeleteValidation()).validateRoute,
      storageController.deleteFiles
    );

    return router;
  }
}

export default FilesRouter;
