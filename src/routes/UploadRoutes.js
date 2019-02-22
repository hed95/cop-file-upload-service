import S3Service from '../services/S3Service';
import StorageController from '../controllers/StorageController';
import ValidationController from '../controllers/ValidationController';
import VirusScanController from '../controllers/VirusScanController';

import config from '../config';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});
const {s3: s3Config, virusScan: virusScanConfig} = config.services;

router.get(
  '/uploads/:filename',
  new StorageController(new S3Service(s3Config)).downloadFile
);

router.post(
  '/uploads',
  upload.single('file'),
  new ValidationController().validatePost,
  new VirusScanController(virusScanConfig).scanFile,
  new StorageController(new S3Service(s3Config)).uploadFile
);

export default router;
