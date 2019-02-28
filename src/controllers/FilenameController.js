class FilenameController {
  constructor(uuid, config) {
    this.uuid = uuid;
    this.config = config;
    this.generateFilename = this.generateFilename.bind(this);
  }

  generateFilename(req, res, next) {
    req.file.filename = this.uuid();
    req.file.version = this.config.fileVersions.original;
    next();
  }
}

export default FilenameController;
