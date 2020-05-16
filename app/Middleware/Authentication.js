'use strict'

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const UserSchema = pxl.Model('User')

// Creating JWT Strategy with Passport.js
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_KEY
}
const strategy = new JwtStrategy(opts, async (jwtPayload, next) => {
  try {
    const userExist = await UserSchema.findById(jwtPayload._id)
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

module.exports = (req, res, next) => {}
