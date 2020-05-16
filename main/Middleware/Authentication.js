'use strict'

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const roles = require('user-groups-roles')

const UserSchema = require('@pxl/Models/User')

// Creating JWT Strategy with Passport.js
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_KEY
}
const strategy = new JwtStrategy(opts, async (jwtPayload, next) => {
  try {
    const userExist = await UserSchema.findById(jwtPayload._id).select(
      '_id fullname email role'
    )
    if (userExist) return next(null, userExist)

    return next(null, false)
  } catch (error) {
    return next(error, false)
  }
})
passport.use(strategy)
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

// Creating authentication middleware
class AuthenticationMiddleware {
  isAuthenticated(args) {
    return async (req, res, next) => {
      if (args) {
        const preparePassportJs = await passport.authenticate(
          'jwt',
          { session: false },
          (err, user) => {
            if (err) {
              return next(err)
            }

            if (!user) {
              return next(
                new pxl.ErrorHandler(
                  401,
                  `You cannot access this page. Please sign in to access this page.`,
                  'UnauthorizedUser'
                )
              )
            }

            req.logIn(user, function(err) {
              if (err) {
                return next(err)
              }
              return next()
            })
          }
        )(req, res, next)

        return preparePassportJs
      }
      return next()
    }
  }

  checkPermission(args) {
    return async (req, res, next) => {
      if (args.permissions && args.path && args.method) {
        const verifyPermission = await roles.getRoleRoutePrivilegeValue(
          req.user.role,
          args.path,
          args.method
        )

        if (!verifyPermission) {
          return next(
            new pxl.ErrorHandler(
              401,
              'You cannot access this endpoint.',
              'UnauthorizedUser'
            )
          )
        }
      }
      return next()
    }
  }
}

module.exports = new AuthenticationMiddleware()
