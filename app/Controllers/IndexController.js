'use strict'

const passport = require('passport')

class IndexController {
  homepage(req, res, next) {
    res.status(200).json({
      user: passport.authenticate('jwt', { session: false })
    })
  }
}

module.exports = new IndexController()
