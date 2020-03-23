'use strict'

const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

// Schema
const ProductSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      slug: ['title', '_id'],
      unique: true,
      index: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    photo: String,
    price: {
      type: Number,
      required: true
    },
    stockQuantity: Number,
    rating: [Number]
  },
  { timestamps: true }
)

// Plugins
mongoose.plugin(slug)

module.exports = mongoose.model('Product', ProductSchema)
