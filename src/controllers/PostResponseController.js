class PostResponseController {
  constructor(config) {
    this.config = config;
    this.response = this.response.bind(this);
  }

  response(req, res) {
    const {file, params} = req;
    const {endpoints, fileVersions} = this.config;
    res.status(200).json({
      url: `${endpoints.files}/${params.processKey}/${fileVersions.original}/${file.filename}`,
      name: req.file.originalname,
      size: req.file.size
    });
  }
}

export default PostResponseController;
