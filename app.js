const express = require('express')
const glob = require('glob')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const consola = require('consola')
const mongoose = require('mongoose')
const passport = require('passport')

require('dotenv').config()

const database = require('./config/database')
const GlobalMiddleware = require('./app/Middleware/index')

const app = express()

// Defining database
if (process.env.DB_CONNECTION) {
  mongoose
    .connect(
      `mongodb://${database.mongodb.connection.user}:${database.mongodb.connection.password}@${database.mongodb.connection.host}:${database.mongodb.connection.port}/${database.mongodb.connection.database}`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    .then(() => {
      consola.ready({
        message: `MongoDB database successfully connected.`,
        badge: true
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// Defining middlewares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
require('./app/Middleware/JwtStrategy')(passport)

// Defining routes
glob.sync('./routes/**/*.json').forEach((file) => {
  let routerFile = require(path.resolve(file))

  routerFile.routes.forEach((route) => {
    let method = route.method.toLowerCase()

    // Custom middleware
    let CustomMiddleware = []
    if (route.middleware) {
      CustomMiddleware = route.middleware
        .map((middleware) => eval(middleware))
        .filter((middleware) => middleware !== undefined)
    }

    // Check authenticated
    let Authenticate = (req, res, next) => {
      if (route.authenticated) {
        res.locals.permission = route.permission
        return passport.authenticate('jwt', { session: false })(req, res, next)
      }
      next()
    }

    // Controllers
    let ControllerFile = route.handler.split('.')[0]
    ControllerFile = require(`./app/controllers/${ControllerFile}`)
    let ControllerFunc = route.handler.split('.')[1]
    let Controller = ControllerFile[ControllerFunc]
    if (!Controller) consola.error(new Error('Controller method is not found.'))

    // HTTP methods
    switch (method) {
      // GET method
      case 'get':
        app.get(
          route.path,
          Authenticate,
          GlobalMiddleware,
          CustomMiddleware,
          Controller
        )
        break

      // POST method
      case 'post':
        app.post(
          route.path,
          Authenticate,
          GlobalMiddleware,
          CustomMiddleware,
          Controller
        )
        break

      // PUT method
      case 'put':
        app.put(
          route.path,
          Authenticate,
          GlobalMiddleware,
          CustomMiddleware,
          Controller
        )
        break

      // PATCH method
      case 'patch':
        app.patch(
          route.path,
          Authenticate,
          GlobalMiddleware,
          CustomMiddleware,
          Controller
        )
        break

      // DELETE method
      case 'delete':
        app.delete(
          route.path,
          Authenticate,
          GlobalMiddleware,
          CustomMiddleware,
          Controller
        )
        break

      default:
        consola.error(
          new Error(
            `"${route.method}" HTTP method is not valid. (${path.resolve(
              file
            )})`
          )
        )
        break
    }
  })
})

module.exports = app
