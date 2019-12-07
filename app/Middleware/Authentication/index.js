'use strict'

const passport = require('passport')
const roles = require('user-groups-roles')

class AuthenticationMiddleware {
  isAuthenticated(args) {
    return async (req, res, next) => {
      if (args) {
        return await passport.authenticate(
          'jwt',
          { session: false },
          (err, user, info) => {
            if (err) {
              return next(err)
            }

            if (!user) {
              return res.status(401).json({
                success: false,
                message: 'Unauthorized user. You must be logged in.'
              })
            }

            req.logIn(user, function(err) {
              if (err) {
                return next(err)
              }
              return next()
            })
          }
        )(req, res, next)
      }
      return next()
    }
  }

  checkPermission(args) {
    return (req, res, next) => {
      if (args.permissions && args.path && args.method) {
        const verifyPermission = roles.getRoleRoutePrivilegeValue(
          req.user.role,
          args.path,
          args.method
        )

        if (!verifyPermission) {
          return res.status(401).json({
            success: false,
            message: `You cannot access this endpoint. Your role is '${
              req.user.role
            }'. If you want to access, your role must be '${Object.keys(
              args.permissions
            ).join(' or ')}'`
          })
        }
      }
      return next()
    }
  }
}

module.exports = new AuthenticationMiddleware()
