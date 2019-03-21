class FilenameController {
  constructor(uuid, processedTime) {
    this.uuid = uuid;
    this.processedTime = processedTime;
    this.generateFilename = this.generateFilename.bind(this);
  }

  generateFilename(req, res, next) {
    req.file.filename = this.uuid();
    req.file.processedTime = this.processedTime;
    next();
  }
}

export default FilenameController;
