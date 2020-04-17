'use strict'

const { body } = require('express-validator')
const UserSchema = pxl.Model('User')

class AuthValidator {
  // [POST] Sign up page
  signUp() {
    return [
      body('username')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .custom(async (username) => {
          const user = await UserSchema.findOne({ username })
          if (user)
            throw new Error(
              'This username already taken. Please try with different username.'
            )
          return true
        })
        .trim()
        .escape(),
      body('email')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isEmail()
        .withMessage('email')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .custom(async (email) => {
          const user = await UserSchema.findOne({ email })
          if (user)
            throw new Error(
              'This email already taken. Please try with different email.'
            )
        })
        .trim()
        .normalizeEmail(),
      body('password')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .trim()
        .escape()
    ]
  }

  // [POST] Sign in page
  signIn() {
    return [
      body('email')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isEmail()
        .withMessage('email')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .trim()
        .normalizeEmail(),
      body('password')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .trim()
        .escape()
    ]
  }
}

module.exports = new AuthValidator()
