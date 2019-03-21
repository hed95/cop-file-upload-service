class PostResponseController {
  constructor(config) {
    this.config = config;
    this.response = this.response.bind(this);
  }

  response(req, res) {
    const {file} = req;
    const {fileVersions} = this.config;
    res.status(200).json({
      url: `/${fileVersions.clean}/${file.filename}`,
      name: req.file.originalname,
      size: req.file.size
    });
  }
}

export default PostResponseController;
