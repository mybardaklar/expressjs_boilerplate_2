'use strict'

const Joi = require('@hapi/joi')

class CategoryValidator {
  // [POST] Create a category
  async create(args) {
    const Schema = await Joi.object({
      type: Joi.string()
        .required()
        .max(24)
    }).validateAsync(args)

    return Schema
  }
}

module.exports = new CategoryValidator()
