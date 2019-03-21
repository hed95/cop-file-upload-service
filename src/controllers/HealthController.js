class HealthController {
  healthCheck(req, res) {
    res.status(200).json({status: 'OK'});
  }

  readinessCheck(req, res) {
    res.status(200).json({ready: true});
  }
}

export default HealthController;
