import IS3DownloadParams from './IS3DownloadParams';

interface IS3UploadParams extends IS3DownloadParams {
  Body: Express.Multer.File['buffer'];
  ServerSideEncryption: string | undefined;
  SSEKMSKeyId: string | undefined;
  ContentType: Express.Multer.File['mimetype'];
  Metadata: {
    originalfilename: Express.Multer.File['originalname'],
    processedtime: string
  };
}

export default IS3UploadParams;
