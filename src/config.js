import dotenv from 'dotenv';

if (['dev', 'test'].includes(process.env.NODE_ENV)) {
  dotenv.config();
}

const config = {
  port: process.env.PORT || 8181,
  services: {
    virusScan: {
      url: process.env.VIRUS_SCAN_URL || 'http://localhost',
      port: process.env.VIRUS_SCAN_PORT || 8080,
      path: '/scan'
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sseKmsKeyId: process.env.SSE_KMS_KEY_ID,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
      serverSideEncryption: 'aws:kms',
      rawFilesDirectory: 'raw-files'
    }
  }
};

export default config;
