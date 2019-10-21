'use strict'

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/User')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.APP_KEY

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const userExist = await User.findById(jwt_payload._id).select(
          '_id username email role'
        )
        if (userExist) return done(null, userExist)

        return done(null, false)
      } catch (error) {
        console.log(error)
        return done(error, false)
      }
    })
  )
}
