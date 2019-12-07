const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')

// Schema
const UserSchema = mongoose.Schema(
  {
    name: {
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
  let User = this

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

// Validations
const validation = {}
validation.signUp = async (args) => {
  return await Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required()
      .min(6)
      .max(75),
    password: Joi.string()
      .required()
      .min(6)
      .max(75),
    role: Joi.string()
  }).validateAsync(args)
}
validation.signIn = async (args) => {
  return await Joi.object({
    email: Joi.string()
      .email()
      .required()
      .min(6)
      .max(75),
    password: Joi.string()
      .required()
      .min(6)
      .max(75)
  }).validateAsync(args)
}

module.exports = {
  validation,
  model: mongoose.model('User', UserSchema)
}
