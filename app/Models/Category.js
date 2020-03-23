'use strict'

const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

// Schema
const CategorySchema = mongoose.Schema(
  {
    slug: {
      type: String,
      slug: ['type', '_id'],
      unique: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

// Plugins
mongoose.plugin(slug)

module.exports = mongoose.model('Category', CategorySchema)
