'use strict'

class IndexController {
  homepage(req, res, next) {
    return res.json({
      message: 'Hello world'
    })
  }

  upload(req, res, next) {
    req.fileUpload.move(req)
    console.log(req.file)
    return res.json(req.file)
  }
}

module.exports = new IndexController()
