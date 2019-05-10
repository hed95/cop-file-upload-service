import * as express from 'express';
import * as joi from 'joi';
import * as multer from 'multer';
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
import FileService from '../services/FileService';
import S3Service from '../services/S3Service';
import FileConverter from '../utils/FileConverter';
import ImageFileConverter from '../utils/ImageFileConverter';
import ImageOcr from '../utils/ImageOcr';
import PdfOcr from '../utils/PdfOcr';
import TextFileConverter from '../utils/TextFileConverter';

const fileService = new FileService();
const storage: multer.StorageEngine = multer.diskStorage({
  destination: config.uploadDirectory,
  filename: (req: any, file: any, cb: any) => {
    cb(null, fileService.formatFilename(config.fileVersions.original, req.uuid));
  }
});
const upload: multer.Instance = multer({storage});
const s3Service: S3Service = new S3Service(config, util);
const storageController: StorageController = new StorageController(s3Service, config, fileService);

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
      new MetadataController(Date.now(), config).generateMetadata,
      storageController.uploadFile,
      new VirusScanController(config, fileService).scanFile,
      new FileConversionController(
        new FileConverter(util, config, ImageFileConverter, TextFileConverter), config, fileService
      ).convertFile,
      new OcrController(config, ImageOcr, PdfOcr, fileService).parseFile,
      new FileConversionController(
        new FileConverter(util, config, ImageFileConverter, TextFileConverter), config, fileService
      ).convertFile,
      storageController.uploadFile,
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
