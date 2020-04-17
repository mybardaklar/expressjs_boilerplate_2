'use strict'

const mongoose = require('mongoose')

// Schema
const SnapSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Snap', SnapSchema)
