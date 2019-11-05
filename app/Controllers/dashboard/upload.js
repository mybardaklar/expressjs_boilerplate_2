'use strict'

class UploadController {
  async index(req, res, next) {
    res.status(200).json({
      message: 'Everyone can access this page.'
    })
  }

  async create(req, res, next) {
    res.status(200).json({
      file: req.files
    })
  }
}

module.exports = new UploadController()
