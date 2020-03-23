'use strict'

const { body } = require('express-validator')

class IndexValidator {
  // [POST] Create an owner
  create() {
    return [
      body('name')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .trim(),
      body('about')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .trim()
        .escape()
    ]
  }
}

module.exports = new IndexValidator()
