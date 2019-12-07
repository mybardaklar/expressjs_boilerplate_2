'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = require('app/Models/UserSchema')

class AuthController {
  // Sign up controller
  async signUp(req, res, next) {
    try {
      // Create a new user
      const newUser = new UserSchema.model({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })

      // Validate fields
      const { validationError } = await UserSchema.validation.signUp(req.body)
      if (validationError) return res.status(400).json(validationError)

      await newUser.save()

      // Create and assign a token and sign in
      const payload = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
      const token = jwt.sign(payload, process.env.APP_KEY)

      res.status(201).json({
        success: true,
        tokenType: 'Bearer',
        token: token,
        user: payload
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  // Sign in controller
  async signIn(req, res, next) {
    try {
      // Validate fields
      const { validationError } = await UserSchema.validation.signIn(req.body)
      if (validationError) return res.status(400).json(validationError)

      // Checking username
      const user = await UserSchema.model.findOne({ email: req.body.email })
      if (!user) return res.status(400).json({ error: 'User is not found.' })

      // Checking password
      const validPass = await bcrypt.compare(req.body.password, user.password)
      if (!validPass)
        return res.status(400).json({ error: 'Invalid password.' })

      // create and assign a token
      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      let token = null

      if (req.query.rememberMe) {
        token = jwt.sign(payload, process.env.APP_KEY)
      } else {
        token = jwt.sign(payload, process.env.APP_KEY, {
          expiresIn: '1d'
        })
      }

      res.status(200).json({
        success: true,
        tokenType: 'Bearer',
        token: token,
        user: payload
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}

module.exports = new AuthController()
