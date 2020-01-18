'use strict'

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
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
    // this.initNuxtApp()
    this.assets()
    this.providers()
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
    this.app.use(passport.initialize())
  }

  async initNuxtApp() {
    const { Nuxt, Builder } = require('nuxt')

    // Import and Set Nuxt.js options
    const config = require('@pxlayer/nuxt.config.js')
    config.dev = process.env.NODE_ENV !== 'production'

    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    const { host, port } = nuxt.options.server

    // Build only in dev mode
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    } else {
      await nuxt.ready()
    }

    // Give nuxt middleware to express
    this.app.use(nuxt.render)

    // Set host and port
    this.host = host
    this.port = port
  }

  // Set the static paths
  assets() {
    this.app.use(express.static(path.join(process.cwd(), 'static')))
  }

  // Set the all providers
  providers() {
    this.Providers.Database()
    this.Providers.Router.init()

    if (pxlayerConfig.isItRestfulAPI)
      this.app.use('/api', this.Providers.Router.routes)
    else this.app.use(this.Providers.Router.routes)
  }
}

module.exports = new Server()
