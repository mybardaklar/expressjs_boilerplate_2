'use strict'

const Joi = require('@hapi/joi')

class UserValidator {
  // [POST] Sign up page
  async signUp(args) {
    const Schema = await Joi.object({
      fullname: Joi.string().required(),
      email: Joi.string()
        .email()
        .trim()
        .required()
        .min(6)
        .max(75),
      password: Joi.string()
        .required()
        .min(6)
        .max(75),
      role: Joi.string()
    }).validateAsync(args)

    return Schema
  }

  // [POST] Sign in page
  async signIn(args) {
    const Schema = await Joi.object({
      email: Joi.string()
        .email()
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

module.exports = new UserValidator()
