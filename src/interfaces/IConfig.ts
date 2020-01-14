interface IConfig {
  port: string | number;
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
}

export default IConfig;
