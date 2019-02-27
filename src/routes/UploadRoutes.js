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
const {s3: s3Config, virusScan: virusScanConfig} = config.services;

router.get(
  '/uploads/:processKey/:filename',
  new StorageController(new S3Service(s3Config, util)).downloadFile
);

router.post(
  '/uploads',
  upload.single('file'),
  new ValidationController().validatePost,
  new FilenameController(uuid).generateFilename,
  new VirusScanController(virusScanConfig).scanFile,
  new OcrController(ocr).parseFile,
  new StorageController(new S3Service(s3Config, util)).uploadFile
);

export default router;
