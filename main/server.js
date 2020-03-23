'use strict'

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const consola = require('consola')
const passport = require('passport')
const pxlayerConfig = require('@pxlayer/pxlayer.config')

class Server {
  constructor() {
    this.app = express()
    this.Providers = require('@pxlayer/Providers')

    this.host = process.env.HOST || 'localhost'
    this.port = process.env.PORT || 4747

    this.middleware()
    this.assets()
    this.providers()
    this.errorHandler()
    this.listen()
  }

  // Listen the server
  listen() {
    this.app.listen(this.port, this.host)
    consola.ready({
      message: `Server listening on \`http://${this.host}:${this.port}\``,
      badge: true
    })
  }

  // Initialize middlewares
  middleware() {
    this.app.use(logger('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    this.app.use(cors())
    this.app.use(passport.initialize())
  }

  // Set the static paths
  assets() {
    this.app.use(express.static(path.join(process.cwd(), 'static')))
  }

  // Set the all providers
  providers() {
    this.Providers.Database
    this.Providers.Router.init()

    if (pxlayerConfig.isItRestfulAPI)
      this.app.use('/api', this.Providers.Router.routes)
    else this.app.use(this.Providers.Router.routes)
  }

  // Error handling
  errorHandler() {
    this.app.use((error, req, res, next) => {
      const { statusCode, message, data } = error
      return res.status(statusCode || 500).json({
        success: false,
        message: message || 'Internal Server Error',
        statusCode: statusCode || 500,
        ...data
      })
    })
  }
}

module.exports = new Server()
