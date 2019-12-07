'use strict'

class UploadController {
  async index(req, res, next) {
    res.status(200).json({
      message: '/uploads (Everyone can access this page.)'
    })
  }

  async create(req, res, next) {
    res.status(200).json({
      file: req.file
    })
  }
}

module.exports = new UploadController()
