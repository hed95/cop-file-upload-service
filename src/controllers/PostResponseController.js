class PostResponseController {
  constructor(config) {
    this.config = config;
    this.response = this.response.bind(this);
  }

  response(req, res) {
    const {file} = req;
    const {fileVersions} = this.config;
    req.logger.info(`File url: ${`/${fileVersions.original}/${file.filename}`}`);
    res.status(200).json({
      url: `/${fileVersions.original}/${file.filename}`,
      name: req.file.originalname,
      size: req.file.size
    });
  }
}

export default PostResponseController;
