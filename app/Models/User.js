const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
      min: 3,
      max: 25
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      max: 75
    },
    password: {
      type: String,
      required: true,
      max: 75
    },
    role: {
      type: String,
      required: true,
      default: 'user'
    }
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)
