'use strict'

const Joi = require('@hapi/joi')

class IndexValidator {
  // [POST] Create an owner
  async create(args) {
    return await Joi.object({
      name: Joi.string().required(),
      about: Joi.string().required(),
      photo: Joi.string()
    }).validateAsync(args)
  }
}

module.exports = new IndexValidator()
