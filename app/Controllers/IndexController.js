'use strict'

const { validationResult } = require('express-validator')

class IndexController {
  homepage(req, res, next) {
    /* throw new pxl.ErrorHandler(408, 'asdas', {
      deneme: 'asdas'
    }) */
    res.json({
      success: true
    })
  }

  async upload(req, res, next) {
    try {
      // Validation
      const errors = await validationResult(req)
      if (!errors.isEmpty())
        throw new pxl.ErrorHandler(422, 'Validation error.', {
          errors: errors.mapped()
        })

      await req.pxl.upload(req)

      return res.status(200).json(req.file)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = new IndexController()
