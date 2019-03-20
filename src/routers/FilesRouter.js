import FileConverter from '../utils/FileConverter';
import FilenameController from '../controllers/FilenameController';
import GetValidationController from '../controllers/GetValidationController';
import OcrController from '../controllers/OcrController';
import PostResponseController from '../controllers/PostResponseController';
import PostValidationController from '../controllers/PostValidationController';
import S3Service from '../services/S3Service';
import StorageController from '../controllers/StorageController';
import VirusScanController from '../controllers/VirusScanController';

import config from '../config';
import express from 'express';
import gm from 'gm';
import joi from 'joi';
import multer from 'multer';
import ocr from 'tesseractocr';
import util from 'util';
import uuid from 'uuid/v4';

const storage = multer.memoryStorage();
const upload = multer({storage});
const {s3: s3Config} = config.services;
const s3Service = new S3Service(s3Config, util);
const storageController = new StorageController(s3Service, config);

class FilesRouter {
  static router() {
    const router = express.Router();

    router.get(
      `${config.endpoints.files}/:processKey/:fileVersion/:filename`,
      new GetValidationController(joi).validateRoute,
      storageController.downloadFile
    );

    router.post(
      `${config.endpoints.files}/:processKey`,
      upload.single('file'),
      new PostValidationController(joi).validateRoute,
      new FilenameController(uuid).generateFilename,
      storageController.uploadFile,
      new VirusScanController(new FileConverter(gm, util, config), config).scanFile,
      storageController.uploadFile,
      new OcrController(ocr, config).parseFile,
      storageController.uploadFile,
      new PostResponseController(config).response
    );

    return router;
  }
}

export default FilesRouter;
