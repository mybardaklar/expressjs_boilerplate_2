'use strict'

class UserController {
  index(req, res, next) {
    res.status(200).json({
      message: 'Everyone can access this page.'
    })
  }

  user(req, res, next) {
    res.status(200).json({
      message: 'USERS'
    })
  }

  moderator(req, res, next) {
    res.status(200).json({
      message: 'MODERATORS'
    })
  }

  admin(req, res, next) {
    res.status(200).json({
      message: 'ADMIN'
    })
  }
}

module.exports = new UserController()
