'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = pxl.Model('User')
const { validationResult } = require('express-validator')

class AuthController {
  // Sign up controller
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ success: false, errors: errors.mapped() })

      // Create a new user
      const newUser = new UserSchema(req.body)
      await newUser.save()

      await pxl.Mail.template('welcome')
        .from('hi@example.com')
        .to('test@example.com')
        .send({
          name: newUser.fullname,
          token: newUser.token,
          code: await jwt.verify(newUser.token, process.env.APP_KEY).code
        })

      return res.status(201).json({
        success: true,
        message:
          'Successfully signed up and vertification code sent to your email.'
      })
    } catch (error) {
      return next(error)
    }
  }

  // Sign in controller
  async signIn(req, res, next) {
    try {
      // Checking username
      const doc = await UserSchema.findOne({ email: req.body.email })
      if (!doc) {
        throw {
          success: false,
          message: 'Email or password is not correct.'
        }
      }

      // Checking password
      const validPass = await bcrypt.compare(req.body.password, doc.password)
      if (!validPass) {
        throw {
          success: false,
          message: 'Email or password is not correct.'
        }
      }

      // create and assign a token
      const payload = {
        _id: doc._id,
        fullname: doc.fullname,
        email: doc.email,
        role: doc.role
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
          type: 'bearer',
          encoded: token
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  async vertification(req, res, next) {
    try {
      const token = await jwt.verify(req.params.token, process.env.APP_KEY)
      const doc = await UserSchema.findOne({ email: token.email })
      if (!doc) {
        throw {
          success: false,
          message: 'Unregistered user.'
        }
      } else if (doc.is_active) {
        throw {
          success: false,
          message: 'This user is already approved.'
        }
      }

      console.log(req.body)

      if (token.code === parseInt(req.body.code)) {
        await UserSchema.updateOne(
          { email: doc.email },
          { is_active: true, token: null }
        )

        res.json({
          success: true,
          message: 'Your membership has been approved.'
        })
      } else {
        throw {
          success: false,
          message: 'Verification code is wrong.'
        }
      }
    } catch (error) {
      return next(error)
    }
  }

  // Get user informations
  async me(req, res, next) {
    try {
      const doc = await req.user

      return res.status(200).json({
        success: true,
        user: doc
      })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new AuthController()
