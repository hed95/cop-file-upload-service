interface IConfig {
  endpoints: {
    files: string,
    health: string,
    readiness: string
  };
  fileConversions: {
    pdfDensity: number,
    token: string
  };
  fileVersions: {
    original: string,
    clean: string,
    ocr: string
  };
  port: string | number;
  services: {
    virusScan: {
      host: string,
      port: string | number,
      path: string
    },
    s3: {
      accessKeyId?: string,
      secretAccessKey?: string,
      sseKmsKeyId?: string,
      bucket?: string,
      region?: string,
      serverSideEncryption?: string
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
  uploadDirectory: string;
}

export default IConfig;
