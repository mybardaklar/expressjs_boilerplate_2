'use strict'

const Joi = require('@hapi/joi')

class UploadValidator {
  single(args) {
    const Schema = Joi.object({
      name: Joi.string()
        .required()
        .empty()
        .trim(),
      email: Joi.string()
        .required()
        .empty()
        .trim(),
      files: Joi.object()
    })
    return Schema.validate(args)
  }
}

module.exports = new UploadValidator()
