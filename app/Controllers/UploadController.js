'use strict'

const { validationResult } = require('express-validator')

class UploadController {
  async single(req, res, next) {
    try {
      // Validation
      const errors = await validationResult(req)
      if (!errors.isEmpty())
        throw new pxl.ErrorHandler(422, 'ValidationError', 'ValidationError', {
          errors: errors.mapped()
        })

      // Upload the file to specified path
      await req.pxl.move(req)

      console.log(req.body)

      return res.status(201).send({ ...req.body })
    } catch (error) {
      return next(error)
    }
  }

  async multiple(req, res, next) {
    try {
      // Validation
      const errors = await validationResult(req)
      if (!errors.isEmpty())
        throw new pxl.ErrorHandler(422, 'ValidationError', 'ValidationError', {
          errors: errors.mapped()
        })

      // Upload the file to specified path
      await req.pxl.move(req)

      return res.status(201).send({ ...req.body })
    } catch (error) {
      return next(error)
    }
  }

  async fields(req, res, next) {
    await req.pxl.file(req)
    await req.pxl.move(req)

    return res.status(201).send({ ...req.body })
  }
}

module.exports = new UploadController()
