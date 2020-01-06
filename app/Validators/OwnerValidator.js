'use strict'

const Joi = require('@hapi/joi')

class CategoryValidator {
  // [POST] Create an owner
  async create(args) {
    const Schema = await Joi.object({
      name: Joi.string()
        .required()
        .min(6)
        .max(36),
      about: Joi.string(),
      photo: Joi.string()
    }).validateAsync(args)

    return Schema
  }
}

module.exports = new CategoryValidator()
