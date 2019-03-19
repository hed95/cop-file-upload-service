import Environment from './utils/Environment';

import dotenv from 'dotenv';

if (Environment.isNotProd(process.env.NODE_ENV)) {
  dotenv.config();
}

const config = {
  port: process.env.PORT || 8181,
  endpoints: {
    files: '/files'
  },
  services: {
    virusScan: {
      host: process.env.VIRUS_SCAN_HOST || 'localhost',
      port: process.env.VIRUS_SCAN_PORT || 8080,
      path: '/scan'
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sseKmsKeyId: process.env.SSE_KMS_KEY_ID,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION,
      serverSideEncryption: 'aws:kms'
    },
    keycloak: {
      authServerUrl: process.env.AUTH_URL,
      realm: process.env.AUTH_REALM,
      clientId: process.env.AUTH_CLIENT_ID,
      bearerOnly: true,
      confidentialPort: 0,
      resource: 'file-upload-service',
      sslRequired: 'external'
    }
  },
  fileVersions: {
    original: 'orig',
    clean: 'clean',
    ocr: 'ocr'
  },
  fileConversions: {
    count: 2,
    pdfDensity: 300
  }
};

export default config;
