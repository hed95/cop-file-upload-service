import IS3DownloadParams from './IS3DownloadParams';

interface IS3UploadParams extends IS3DownloadParams {
  Body: Express.Multer.File['buffer'];
  ContentType: Express.Multer.File['mimetype'];
  Metadata: {
    originalfilename: Express.Multer.File['originalname'],
    processedtime: string
  };
}

export default IS3UploadParams;
