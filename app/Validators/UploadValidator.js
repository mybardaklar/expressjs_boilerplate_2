'use strict'

const { body } = require('express-validator')

class UploadValidator {
  single() {
    return [
      body('name')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .trim()
        .escape(),
      body('email')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isEmail()
        .withMessage('email')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .trim()
        .normalizeEmail(),
      body('files')
        .exists()
        .withMessage('required')
        .custom((file) => {
          if (!file.single) throw new Error('required')
          return true
        })
    ]
  }

  multiple() {
    return [
      body('name')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .trim()
        .escape(),
      body('email')
        .exists()
        .withMessage('required')
        .notEmpty()
        .withMessage('empty')
        .isString()
        .withMessage('string')
        .isEmail()
        .withMessage('email')
        .isLength({ min: '6', max: '75' })
        .withMessage('length')
        .trim()
        .normalizeEmail(),
      body('files')
        .exists()
        .withMessage('required')
        .custom((files) => {
          if (!files.multiple) throw new Error('required')
          if (files.multiple.length < 1) throw new Error('length')
          return true
        })
    ]
  }
}

module.exports = new UploadValidator()
