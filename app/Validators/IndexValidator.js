'use strict'

const Joi = require('@hapi/joi')

class IndexValidator {
  // [POST] Create an owner
  async create(args) {
    const Schema = await Joi.object({
      name: Joi.string().required(),
      about: Joi.string().required(),
      photo: Joi.string()
    }).validateAsync(args)

    return Schema
  }
}

module.exports = new IndexValidator()
