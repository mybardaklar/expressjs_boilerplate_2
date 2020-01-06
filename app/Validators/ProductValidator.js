'use strict'

const Joi = require('@hapi/joi')

class ProductValidator {
  // [POST] Create a product
  async create(args) {
    const Schema = await Joi.object({
      category: Joi.string().required(),
      owner: Joi.string().required(),
      title: Joi.string()
        .required()
        .min(6)
        .max(75),
      description: Joi.string(),
      photo: Joi.string(),
      price: Joi.number().required(),
      stockQuantity: Joi.number(),
      rating: Joi.array().items(Joi.number())
    }).validateAsync(args)

    return Schema
  }

  // [PUT] Update a product
  async update() {
    const Schema = await Joi.object({
      category: Joi.string(),
      owner: Joi.string(),
      title: Joi.string()
        .min(6)
        .max(75),
      description: Joi.string(),
      photo: Joi.string(),
      price: Joi.number(),
      stockQuantity: Joi.number(),
      rating: Joi.array().items(Joi.number())
    })

    return Schema
  }
}

module.exports = new ProductValidator()
