import IValidFileType from './IValidFileType';

interface IConfig {
  port: string | number;
  protocol: string;
  hostname: string;
  endpoints: {
    files: string,
    health: string,
    readiness: string
  };
  services: {
    virusScan: {
      host: string,
      port: string | number,
      path: string
    },
    s3: {
      accessKeyId?: string,
      secretAccessKey?: string,
      bucket?: string,
      region?: string
    },
    keycloak: {
      authServerUrl?: string,
      realm?: string,
      clientId?: string,
      bearerOnly: boolean,
      confidentialPort: number,
      resource: string,
      sslRequired: string
    }
  };
  fileVersions: {
    original: string,
    clean: string,
    ocr: string
  };
  fileConversions: {
    pdfDensity: number
  };
  validFileTypes: {
    doc: IValidFileType,
    docx: IValidFileType,
    gif: IValidFileType,
    jpg: IValidFileType,
    pdf: IValidFileType,
    xls: IValidFileType,
    xlsx: IValidFileType
  };
  fileSizeLimitInBytes: number;
}

export default IConfig;
