import * as dotenv from 'dotenv';
import IConfig from './interfaces/IConfig';
import Environment from './utils/Environment';

if (Environment.isDev(process.env.NODE_ENV)) {
  dotenv.config();
}

const config: IConfig = {
  endpoints: {
    files: '/files',
    health: '/healthz',
    readiness: '/readiness'
  },
  fileConversions: {
    pdfDensity: 300
  },
  fileSizeLimitInBytes: 25000000,
  fileVersions: {
    clean: 'clean',
    ocr: 'ocr',
    original: 'orig'
  },
  hostname: process.env.FILE_UPLOAD_SERVICE_URL || 'localhost',
  port: process.env.PORT || 8181,
  protocol: process.env.PROTOCOL || 'https://',
  services: {
    keycloak: {
      authServerUrl: process.env.AUTH_URL,
      bearerOnly: true,
      clientId: process.env.AUTH_CLIENT_ID,
      confidentialPort: 0,
      realm: process.env.AUTH_REALM,
      resource: 'file-upload-service',
      sslRequired: 'external'
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY || 'dummy-access-key',
      bucket: process.env.AWS_BUCKET || 'dummy-bucket',
      region: process.env.AWS_REGION || 'dummy-region',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret-access-key'
    },
    virusScan: {
      host: process.env.VIRUS_SCAN_HOST || 'localhost',
      path: '/scan',
      port: process.env.VIRUS_SCAN_PORT || 8080
    }
  },
  validFileTypes: {
    doc: {
      mimetype: 'application/msword',
      signature: 'd0cf11e0a1b11ae1'
    },
    docx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      signature: '504b0304'
    },
    gif: {
      mimetype: 'image/gif',
      signature: '47494638'
    },
    jpg: {
      mimetype: 'image/jpeg',
      signature: 'ffd8ffe0'
    },
    pdf: {
      mimetype: 'application/pdf',
      signature: '25504446'
    },
    xls: {
      mimetype: 'application/vnd.ms-excel',
      signature: 'd0cf11e0a1b11ae1'
    },
    xlsx: {
      mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      signature: '504b0304'
    }
  }
};

export default config;
