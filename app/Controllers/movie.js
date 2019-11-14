'use strict'

const Movie = require('app/Models/movie')

class MovieController {
  async find(req, res, next) {
    const movies = await Movie.find()
      .select(
        '_id cast genres tags title release_date country time original_language budget gain poster slug'
      )
      .populate('cast.actors', '_id fullname birth_date death_date photo slug')
      .populate(
        'cast.directors',
        '_id fullname birth_date death_date photo slug'
      )

    if (movies.length < 1)
      res.status(500).json({ success: true, message: 'No added movie yet.' })

    try {
      res.status(200).json({
        success: true,
        movies
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async create(req, res, next) {
    req.body.poster =
      req.file.destination.replace('static', '') + '/' + req.file.filename

    const newMovie = new Movie(req.body)

    try {
      const { validationError } = await newMovie.validation(req.body)
      if (validationError) return res.status(400).json(validationError)

      const savedMovie = await newMovie.save()
      res.status(201).json({
        success: true,
        movie: savedMovie
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = new MovieController()
