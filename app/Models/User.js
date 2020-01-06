'use strict'

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

// Schema
const UserSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: 'user'
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' }
  },
  { timestamps: true }
)

// Hash password after save
UserSchema.pre('save', async function(next) {
  const User = this

  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(User.password, salt)

      User.password = hashedPassword
      return next()
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
})

// Plugins
mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)
