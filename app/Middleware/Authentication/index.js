'use strict'

const passport = require('passport')

class AuthenticationMiddleware {
  constructor() {
    this.roles = ['user', 'moderator', 'admin']

    this.checkPermission = this.checkPermission.bind(this)
  }

  async isAuthenticated(req, res, next) {
    if (res.locals._authentication.authenticated) {
      return await passport.authenticate('jwt', { session: false })(
        req,
        res,
        next
      )
    }
    return next()
  }

  async checkPermission(req, res, next) {
    if (res.locals._authentication.permission) {
      const permissionIndex = await this.roles.indexOf(
        res.locals._authentication.permission
      )
      const sliceRoles = await this.roles.slice(permissionIndex)
      const isAuthorized = await sliceRoles.filter(
        (role) => role === req.user.role
      )

      if (isAuthorized.length > 0) {
        return next()
      } else {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized user.'
        })
      }
    }
    return next()
  }
}

module.exports = new AuthenticationMiddleware()
