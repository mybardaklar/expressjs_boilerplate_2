'use strict'

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const roles = require('user-groups-roles')

const UserSchema = require('@Models/User')

// Creating JWT Strategy with Passport.js
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_KEY
}
const strategy = new JwtStrategy(opts, async (jwt_payload, next) => {
  try {
    const userExist = await UserSchema.findById(jwt_payload._id).select(
      '_id username email role'
    )
    if (userExist) return next(null, userExist)

    return next(null, false)
  } catch (error) {
    console.log(error)
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
        return await passport.authenticate(
          'jwt',
          { session: false },
          (err, user) => {
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
    return async (req, res, next) => {
      if (args.permissions && args.path && args.method) {
        const verifyPermission = await roles.getRoleRoutePrivilegeValue(
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
