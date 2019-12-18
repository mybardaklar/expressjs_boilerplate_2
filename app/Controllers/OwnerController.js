'use strict'

const OwnerSchema = require('@models/Owner')

class OwnerController {
  async create(req, res, next) {
    try {
      // Upload the photo
      await req.fileUpload(req)

      // Create a new owner
      const newOwner = new OwnerSchema({
        ...req.body,
        photo: req.file.filepath
      })
      await newOwner.save()

      return res.status(200).json({
        success: true,
        owner: newOwner
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  async findAll(req, res, next) {
    try {
      const owners = await OwnerSchema.find().select(
        '_id name about photo slug createdAt updatedAt'
      )

      return res.status(200).json({
        success: true,
        owners
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
}

module.exports = new OwnerController()
