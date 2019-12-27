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

    this.host = 'localhost'
    this.port = 4747

    this.middleware()
    this.assets()
    //this.nuxt()
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

  // Initialize Nuxt.js app
  async nuxt() {
    const { Nuxt, Builder } = require('nuxt')
    const config = require('../nuxt.config.js')
    config.dev = process.env.NODE_ENV !== 'production'

    const nuxt = new Nuxt(config)

    this.host = nuxt.options.server.host
    this.port = nuxt.options.server.port

    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    } else {
      await nuxt.ready()
    }

    this.app.use(nuxt.render)
  }

  // Set the static paths
  async assets() {
    this.app.use(express.static(path.join(__dirname, 'static')))
  }

  // Set the all providers
  async providers() {
    this.Providers.Database()
    this.app.use(this.Providers.Router)
  }
}

module.exports = Server
