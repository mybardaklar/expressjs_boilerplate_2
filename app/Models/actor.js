const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
const uniqueValidator = require('mongoose-unique-validator')
const Joi = require('@hapi/joi')

const Actor = mongoose.Schema(
  {
    slug: {
      type: String,
      slug: ['fullname'],
      unique: true,
      index: true
    },
    photo: {
      type: String,
      required: true
    },
    fullname: {
      type: String,
      required: true
    },
    birth_name: {
      type: String,
      required: true
    },
    birth_place: {
      type: String,
      required: true
    },
    birth_date: {
      type: Date,
      required: true
    },
    death_place: String,
    death_date: Date,
    description: String,
    movies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
      }
    ]
  },
  { timestamps: true }
)

Actor.methods.validation = async (object) => {
  const schema = Joi.object({
    photo: Joi.string().required(),
    fullname: Joi.string().required(),
    birth_name: Joi.string().required(),
    birth_place: Joi.string(),
    birth_date: Joi.date().required(),
    death_place: Joi.string(),
    death_date: Joi.date(),
    description: Joi.string(),
    movies: Joi.array().items(Joi.string())
  })

  return await schema.validateAsync(object)
}

mongoose.plugin(slug)
mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('Actor', Actor)
