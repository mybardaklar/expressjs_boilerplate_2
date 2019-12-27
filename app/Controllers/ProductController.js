'use strict'

const ProductSchema = require('@Models/Product')

class ProductController {
  // [POST] Create a product
  async create(req, res, next) {
    try {
      // Upload the photo
      await req.fileUpload(req)

      // Create a new product
      const newProduct = new ProductSchema({
        ...req.body,
        photo: req.file.filepath
      })
      await newProduct.save()

      return res.status(200).json({
        success: true,
        product: newProduct
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // [GET] Get all products
  async findAll(req, res, next) {
    try {
      const products = await ProductSchema.find().select(
        '_id slug category owner title description photo price stockQuantity rating createdAt updatedAt'
      )

      return res.status(200).json({
        success: true,
        products
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // [GET] Get the specified product
  async find(req, res, next) {
    try {
      const product = await ProductSchema.findOne({
        slug: req.params.slug
      }).select(
        '_id slug category owner title description photo price stockQuantity rating createdAt updatedAt'
      )

      return res.status(200).json({
        success: true,
        product
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // [PUT] Update the specified product
  async update(req, res, next) {
    try {
      // Upload the photo
      await req.fileUpload(req)

      const updatedProduct = await ProductSchema.findOneAndUpdate(
        {
          slug: req.params.slug
        },
        {
          $set: { ...req.body, photo: req.file.filepath }
        }
      )

      return res.status(200).json({
        success: true,
        updatedProduct
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  // [DELETE] Delete the specified product
  async delete(req, res, next) {
    try {
      const deletedProduct = await ProductSchema.findOneAndDelete({
        slug: req.params.slug
      })

      if (deletedProduct) {
        res.status(200).json({
          success: true,
          message: 'Successfully deleted'
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
}

module.exports = new ProductController()
