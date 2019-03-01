import FilenameController from '../controllers/FilenameController';
import OcrController from '../controllers/OcrController';
import S3Service from '../services/S3Service';
import StorageController from '../controllers/StorageController';
import ValidationController from '../controllers/ValidationController';
import VirusScanController from '../controllers/VirusScanController';

import config from '../config';
import express from 'express';
import multer from 'multer';
import ocr from 'tesseractocr';
import util from 'util';
import uuid from 'uuid/v4';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});
const {s3: s3Config} = config.services;

router.get(
  `${config.endpoints.files}/:processKey/:fileVersion/:filename`,
  new StorageController(new S3Service(s3Config, util)).downloadFile
);

router.post(
  config.endpoints.files,
  upload.single('file'),
  new ValidationController().validatePost,
  new FilenameController(uuid, config).generateFilename,
  new StorageController(new S3Service(s3Config, util)).uploadFile,
  new VirusScanController(config).scanFile,
  new StorageController(new S3Service(s3Config, util)).uploadFile,
  new OcrController(ocr, config).parseFile,
  new StorageController(new S3Service(s3Config, util)).uploadFile,
  (req, res) => {
    res.status(200).json({message: 'File uploaded successfully'});
  }
);

export default router;
