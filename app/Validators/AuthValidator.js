'use strict'

const { body } = require('express-validator')
const UserSchema = pxl.Model('User')

class AuthValidator {
  // [POST] Sign up page
  signUp() {
    return [
      body('fullname')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
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
        .custom(async (value) => {
          const user = await UserSchema.findOne({ email: value })
          if (user) throw new Error('E-mail already in use')
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
        .escape(),
      body('role')
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
