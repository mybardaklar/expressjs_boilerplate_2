'use strict'

class IndexController {
  homepage(req, res) {
    return res.json({
      message: 'Hello world'
    })
  }

  upload(req, res) {
    req.fileUpload.move(req)
    console.log(req.file)
    return res.json(req.file)
  }
}

module.exports = new IndexController()
