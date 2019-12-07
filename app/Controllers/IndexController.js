'use strict'

class IndexController {
  homepage(req, res, next) {
    res.json({
      message: 'Hello world'
    })
  }

  upload(req, res, next) {
    res.json(req.files)
  }
}

module.exports = new IndexController()
