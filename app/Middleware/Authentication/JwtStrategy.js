'use strict'

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('app/Models/user')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.APP_KEY
}

const strategy = new JwtStrategy(opts, async (jwt_payload, next) => {
  try {
    const userExist = await User.findById(jwt_payload._id).select(
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
