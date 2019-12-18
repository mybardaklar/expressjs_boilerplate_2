'use strict'

class IndexController {
  homepage(req, res, next) {
    return res.json({
      message: 'Hello world'
    })
  }

  upload(req, res, next) {
    req.fileUpload(req)
    console.log(req.files)
    return res.json(req.files)
  }
}

module.exports = new IndexController()
