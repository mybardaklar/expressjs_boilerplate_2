const Joi = require('@hapi/joi')

const registerValidation = Joi.object({
  username: Joi.string()
    .required()
    .min(3)
    .max(25),
  email: Joi.string()
    .email()
    .required()
    .min(6)
    .max(75),
  password: Joi.string()
    .required()
    .min(6)
    .max(75)
})

const loginValidation = Joi.object({
  username: Joi.string()
    .required()
    .min(3)
    .max(25),
  password: Joi.string()
    .required()
    .min(6)
    .max(75)
})

exports.registerValidation = registerValidation
exports.loginValidation = loginValidation
