'use strict'

const Movie = require('app/Models/movie')

class MovieController {
  async find(req, res, next) {
    const movies = await Movie.find()
      .populate('actors', '_id photo fullname createdAt updatedAt')
      .select('_id poster title release_date genres actors')
    if (movies.length < 1)
      res.status(500).json({ success: false, message: 'No added movie yet.' })

    try {
      res.status(200).render('pages.movies', { head_title: 'Movies', movies })
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async create(req, res, next) {
    req.body.poster = 'uploads/' + req.file.filename

    const newMovie = new Movie(req.body)

    try {
      // validate fields
      const { validationError } = await newMovie.validation(req.body)
      if (validationError) return res.status(400).json(validationError)

      //const savedMovie = await newMovie.save()
      res.status(201).json({
        success: true,
        movie: req.body
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = new MovieController()
