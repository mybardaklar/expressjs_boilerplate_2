'use strict'

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const consola = require('consola')
const passport = require('passport')

class Server {
  constructor() {
    this.app = express()
    this.Providers = require('@pxlayer/providers')

    this.host = process.env.HOST || 'localhost'
    this.port = process.env.PORT || 4747

    this.middleware()
    this.assets()
    this.providers()

    this.listen()
  }

  async listen() {
    this.app.listen(this.port, this.host)
    consola.ready({
      message: `Server listening on \`http://${this.host}:${this.port}\``,
      badge: true
    })
  }

  // Initialize middlewares
  async middleware() {
    this.app.use(logger('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    this.app.use(passport.initialize())
  }

  // Set the static paths
  async assets() {
    this.app.use(express.static(path.join(process.cwd(), 'static')))
  }

  // Set the all providers
  async providers() {
    this.Providers.Database()
    this.app.use(this.Providers.Router)
  }
}

module.exports = Server
