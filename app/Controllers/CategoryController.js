'use strict'

const CategorySchema = pxl.Model('Category')

class CategoryController {
  async create(req, res) {
    try {
      // Create a new category
      const newCategory = new CategorySchema(req.body)
      await newCategory.save()

      return res.status(200).json({
        success: true,
        category: newCategory
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }

  async findAll(req, res) {
    try {
      const categories = await CategorySchema.find().select(
        '_id type slug createdAt updatedAt'
      )

      return res.status(200).json({
        success: true,
        categories
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  }
}

module.exports = new CategoryController()
