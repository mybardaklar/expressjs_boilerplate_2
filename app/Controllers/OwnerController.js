'use strict'

const OwnerSchema = require('@pxlayer/Models/Owner')

class OwnerController {
  async create(req, res) {
    try {
      // Upload the photo
      await req.FileUpload(req)

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

  async findAll(req, res) {
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
