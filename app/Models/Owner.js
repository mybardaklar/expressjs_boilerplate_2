'use strict'

const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

// Schema
const OwnerSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      slug: ['name', '_id'],
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    about: String,
    photo: String
  },
  { timestamps: true }
)

// Plugins
mongoose.plugin(slug)

module.exports = mongoose.model('Owner', OwnerSchema)
