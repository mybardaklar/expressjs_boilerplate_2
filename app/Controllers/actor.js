'use strict'

const Actor = require('app/Models/actor')

class ActorController {
  // find
  async find(req, res, next) {
    try {
      const actors = await Actor.find()
        .select('_id slug photo fullname birth_date death_date')
        .sort({ fullname: 1 })
      if (actors.length < 1)
        res.status(500).json({ success: true, message: 'No added actor yet.' })

      res.status(200).json(actors)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  // create
  async create(req, res, next) {
    req.body.photo =
      req.file.destination.replace('static', '') + '/' + req.file.filename

    const newActor = new Actor(req.body)

    try {
      const { validationError } = await newActor.validation(req.body)
      if (validationError) return res.status(400).json(validationError)

      const savedActor = await newActor.save()
      res.status(201).json({
        success: true,
        actor: savedActor
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = new ActorController()
