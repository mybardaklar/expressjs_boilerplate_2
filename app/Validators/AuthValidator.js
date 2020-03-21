'use strict'

const Joi = require('@hapi/joi')
const { body } = require('express-validator')

/* class AuthValidator {
  // [POST] Sign up page
  async signUp(args) {
    const Schema = await Joi.object({
      fullname: Joi.string().required(),
      email: Joi.string()
        .email()
        .empty()
        .trim()
        .required()
        .min(6)
        .max(75),
      password: Joi.string()
        .required()
        .min(6)
        .max(75),
      role: Joi.string()
    }).validateAsync(args, { context: false })

    return Schema
  }

  // [POST] Sign in page
  async signIn(args) {
    const Schema = await Joi.object({
      email: Joi.string()
        .email()
        .empty()
        .required()
        .min(6)
        .max(75),
      password: Joi.string()
        .required()
        .min(6)
        .max(75)
    }).validateAsync(args)

    return Schema
  }
} */

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
        .withMessage('string'),
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
        .withMessage('length'),
      body('password')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isLength({ min: '6', max: '75' })
        .withMessage('length'),
      body('role')
    ]
  }

  // [POST] Sign in page
  async signIn(args) {
    const Schema = await Joi.object({
      email: Joi.string()
        .email()
        .empty()
        .required()
        .min(6)
        .max(75),
      password: Joi.string()
        .required()
        .min(6)
        .max(75)
    }).validateAsync(args)

    return Schema
  }
}

module.exports = new AuthValidator()
