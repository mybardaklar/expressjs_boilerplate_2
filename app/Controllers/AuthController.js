'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = require('@pxlayer/Models/User')

class AuthController {
  // Sign up controller
  async signUp(req, res) {
    try {
      // Create a new user
      const newUser = new UserSchema(req.body)
      await newUser.save()

      // Create and assign a token and sign in
      const payload = {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role
      }
      const token = jwt.sign(payload, process.env.APP_KEY)

      return res.status(201).json({
        success: true,
        user: payload,
        token: {
          type: 'Bearer',
          encoded: token
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // Sign in controller
  async signIn(req, res) {
    try {
      // Checking username
      const user = await UserSchema.findOne({ email: req.body.email })
      if (!user)
        return res.status(400).json({
          success: false,
          message: 'Email or password is not correct.'
        })

      // Checking password
      const validPass = await bcrypt.compare(req.body.password, user.password)
      if (!validPass)
        return res.status(400).json({
          success: false,
          message: 'Email or password is not correct.'
        })

      // create and assign a token
      const payload = {
        _id: user._id,
        fullname: user.fullname,
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

      return res.status(200).json({
        success: true,
        user: payload,
        token: {
          type: 'Bearer',
          encoded: token
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // Get user informations
  async userprofile(req, res) {
    try {
      const user = await req.user

      return res.status(200).json({
        success: true,
        user
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
}

module.exports = new AuthController()
