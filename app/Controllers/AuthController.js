'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = pxl.Model('User')
const { validationResult } = require('express-validator')

class AuthController {
  // Sign up controller
  async signUp(req, res, next) {
    try {
      // Validation
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new pxl.ErrorHandler(
          422,
          'Please fix validation errors and try again.',
          'ValidationError',
          {
            errors: errors.mapped()
          }
        )
      }

      // Create a new user
      const newUser = new UserSchema(req.body)
      await newUser.save()

      await pxl.Mail.template('welcome')
        .from('hi@example.com')
        .to('test@example.com')
        .send({
          username: newUser.username,
          token: newUser.token,
          code: await jwt.verify(newUser.token, process.env.APP_KEY).code
        })

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message:
          'Successfully signed up and verification code sent to your email.'
      })
    } catch (error) {
      return next(error)
    }
  }

  // Sign in controller
  async signIn(req, res, next) {
    try {
      // Validation
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw new pxl.ErrorHandler(
          422,
          'Please fix validation errors and try again.',
          'ValidationError',
          {
            errors: errors.mapped()
          }
        )
      }

      // Checking email address
      const doc = await UserSchema.findOne({ email: req.body.email })
      if (!doc) {
        throw new pxl.ErrorHandler(
          401,
          'Email or password is not correct. Please try again.',
          'NotCorrect'
        )
      }

      // Checking password
      const validPass = await bcrypt.compare(req.body.password, doc.password)
      if (!validPass) {
        throw new pxl.ErrorHandler(
          401,
          'Email or password is not correct. Please try again.',
          'NotCorrect'
        )
      }

      // create and assign a token
      const payload = {
        _id: doc._id,
        username: doc.username,
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
        statusCode: 200,
        message: 'Successfully signed in.',
        data: {
          user: payload,
          token: {
            type: 'bearer',
            encoded: token
          }
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  async verification(req, res, next) {
    try {
      const token = await jwt.verify(req.params.token, process.env.APP_KEY)
      let doc = await UserSchema.findOne({
        token: req.params.token,
        email: token.email
      })

      if (!doc) {
        throw new pxl.ErrorHandler(
          500,
          'This token is invalid. Please check your token and try again.',
          'InvalidToken'
        )
      } else if (token.code === parseInt(req.body.code)) {
        await UserSchema.updateOne(
          { email: doc.email },
          { is_active: true, token: null }
        )

        res.status(200).json({
          success: true,
          statusCode: 200,
          message: 'Your membership has been approved.'
        })
      } else {
        throw new pxl.ErrorHandler(
          500,
          'Verification code is not correct. Please check your verification code and try again.',
          'VerificationCode'
        )
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
