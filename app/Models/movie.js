const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
const uniqueValidator = require('mongoose-unique-validator')
const Joi = require('@hapi/joi')

const Movie = mongoose.Schema(
  {
    slug: {
      type: String,
      slug: ['title'],
      unique: true,
      index: true
    },
    poster: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    release_date: {
      type: Date,
      required: true
    },
    country: String,
    time: {
      type: String,
      required: true
    },
    original_language: String,
    budget: String,
    gain: String,
    genres: [
      {
        type: String,
        required: true
      }
    ],
    cast: {
      type: Map,
      of: {
        actors: {
          type: mongoose.Schema.ObjectId,
          ref: 'Actor'
        },
        directors: {
          type: mongoose.Schema.ObjectId,
          ref: 'Actor'
        }
      }
    },
    tags: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
)

Movie.methods.validation = async (object) => {
  const schema = Joi.object({
    poster: Joi.string().required(),
    title: Joi.string().required(),
    release_date: Joi.date().required(),
    country: Joi.string(),
    time: Joi.string().required(),
    original_language: Joi.string(),
    budget: Joi.string(),
    gain: Joi.string(),
    genres: Joi.array().items(Joi.string().required()),
    cast: Joi.object({
      actors: Joi.array().items(Joi.string()),
      directors: Joi.array().items(Joi.string())
    }),
    tags: Joi.array().items(Joi.string())
  })

  return await schema.validateAsync(object)
}

mongoose.plugin(slug)
mongoose.plugin(uniqueValidator)

module.exports = mongoose.model('Movie', Movie)
