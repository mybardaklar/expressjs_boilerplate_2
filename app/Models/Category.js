'use strict'

const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
const uniqueValidator = require('mongoose-unique-validator')

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
mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('Category', CategorySchema)
