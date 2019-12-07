'use strict'

class UserController {
  index(req, res, next) {
    res.status(200).json({
      message: 'GET /users/user.'
    })
  }

  user(req, res, next) {
    res.status(200).json({
      message: 'USERS'
    })
  }

  user_create(req, res, next) {
    res.status(200).json({
      success: true,
      file: 'uploads/' + req.file.filename
    })
  }

  async profile(req, res, next) {
    return res.json(req.user)
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
