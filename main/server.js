'use strict'

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const consola = require('consola')
const passport = require('passport')
const pxlConfig = require('@pxl/pxl.config')

class Server {
  constructor() {
    this.app = express()
    this.Providers = require('@pxl/main/Providers')

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

    if (pxlConfig.mode === 'graphql') {
      consola.ready({
        message: `GraphQL server listening on \`http://${this.host}:${this.port}/graphql\``,
        badge: true
      })
    } else {
      consola.ready({
        message: `Server listening on \`http://${this.host}:${this.port}\``,
        badge: true
      })
    }
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
    // Provide database
    this.Providers.Database

    // Provide routes or GraphQL
    switch (pxlConfig.mode) {
      case 'graphql':
        this.Providers.GraphQL.init()
        this.Providers.GraphQL.server.applyMiddleware({ app: this.app })
        break

      case 'restfulapi':
        this.Providers.Router.init()
        this.app.use('/api', this.Providers.Router.routes)
        break

      default:
        this.Providers.Router.init()
        this.app.use(this.Providers.Router.routes)
        break
    }
  }

  // Error handling
  errorHandler() {
    this.app.use((error, req, res, next) => {
      const { statusCode, message, errorCode, data } = error
      return res.status(statusCode || 500).json({
        success: false,
        statusCode: statusCode || 500,
        errorCode: errorCode || '',
        message: message || 'Internal Server Error',
        ...data
      })
    })
  }
}

module.exports = new Server()
