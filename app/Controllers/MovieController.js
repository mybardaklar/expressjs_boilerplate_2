'use strict'

const Movie = require('app/Models/movie')

class MovieController {
  async find(req, res, next) {
    try {
      const movies = await Movie.find()
        .select(
          '_id cast genres tags title release_date country time original_language budget gain poster slug'
        )
        .populate(
          'cast.actors',
          '_id fullname birth_date death_date photo slug'
        )
        .populate(
          'cast.directors',
          '_id fullname birth_date death_date photo slug'
        )

      if (movies.length < 1)
        res.status(200).json({ success: true, message: 'No added movie yet.' })

      res.status(200).json({
        success: true,
        movies
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async create(req, res, next) {
    res.send('MovieController.create')
  }
}

module.exports = new MovieController()
