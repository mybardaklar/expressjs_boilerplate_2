'use strict'

const Joi = require('@hapi/joi')

class CategoryValidator {
  // [POST] Create a category
  async create(args) {
    return await Joi.object({
      type: Joi.string()
        .required()
        .max(24)
    }).validateAsync(args)
  }
}

module.exports = new CategoryValidator()
