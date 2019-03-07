class FilenameController {
  constructor(uuid) {
    this.uuid = uuid;
    this.generateFilename = this.generateFilename.bind(this);
  }

  generateFilename(req, res, next) {
    req.file.filename = this.uuid();
    next();
  }
}

export default FilenameController;
