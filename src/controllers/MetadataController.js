class MetadataController {
  constructor(uuid, processedTime) {
    this.uuid = uuid;
    this.processedTime = processedTime;
    this.generateMetadata = this.generateMetadata.bind(this);
  }

  generateMetadata(req, res, next) {
    req.file.filename = this.uuid();
    req.file.processedTime = this.processedTime;
    next();
  }
}

export default MetadataController;
