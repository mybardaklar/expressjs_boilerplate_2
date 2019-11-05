'use strict'

const passport = require('passport')

class IndexController {
  homepage(req, res, next) {
    res.render('index', {
      head_title: 'Homepage'
    })
  }
}

module.exports = new IndexController()
