// Include required packages
const express = require('express')
const pug = require('pug')
const glob = require('glob')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const consola = require('consola')
const mongoose = require('mongoose')
const passport = require('passport')
const compose = require('compose-middleware').compose

// Activate .env file and root directory config
require('dotenv').config()
require('app-module-path').addPath(__dirname)

const app = express()

// Include config files
const database = require('./config/database')

// Defining MongoDB
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
        message: `MongoDB successfully connected.`,
        badge: true
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

// Defining middleware
const GlobalMiddleware = require('./app/Middleware/index')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))
app.use(passport.initialize())

// Configure Pug template engline
app.set('view engine', 'pug')

// Defining authentication middleware
require('app/Middleware/Authentication/JwtStrategy')
const Authentication = require('app/Middleware/Authentication/index')
const AuthenticationMiddleware = [
  Authentication.isAuthenticated,
  Authentication.checkPermission
]

// Defining routes
glob.sync('app/Routes/**/*.json').forEach((file) => {
  let routerFile = require(path.resolve(file))

  routerFile.routes.forEach((route) => {
    let method = route.method.toLowerCase()

    // Custom middleware
    let CustomMiddleware = []
    if (route.middleware) {
      route.middleware.forEach((middleware) => {
        let Middleware = middleware.split('.')
        let MiddlewareFile = require(`app/Middleware/${Middleware.slice(
          0,
          -1
        ).join('.')}`)
        let MiddlewareMethod = Middleware.slice(-1)
        Middleware = MiddlewareFile[MiddlewareMethod]
        if (!Middleware)
          consola.error(new Error('Middleware method is not found.'))
        else CustomMiddleware.push(Middleware)
      })
    }

    // Transfer authentication informations
    let PagePermissions = (req, res, next) => {
      res.locals._authentication = {
        authenticated: route.authenticated,
        permission: route.permission
      }
      next()
    }

    // Controllers
    let Controller = route.handler.split('.')
    let ControllerFile = require(`app/Controllers/${Controller.slice(
      0,
      -1
    ).join('.')}`)
    let ControllerMethod = Controller.slice(-1)
    Controller = ControllerFile[ControllerMethod]
    if (!Controller) consola.error(new Error('Controller method is not found.'))

    // HTTP methods
    switch (method) {
      // GET method
      case 'get':
        app.get(
          route.path,
          PagePermissions,
          compose(AuthenticationMiddleware),
          compose(GlobalMiddleware),
          compose(CustomMiddleware),
          Controller
        )
        break

      // POST method
      case 'post':
        app.post(
          route.path,
          PagePermissions,
          compose(AuthenticationMiddleware),
          compose(GlobalMiddleware),
          compose(CustomMiddleware),
          Controller
        )
        break

      // PUT method
      case 'put':
        app.put(
          route.path,
          PagePermissions,
          compose(AuthenticationMiddleware),
          compose(GlobalMiddleware),
          compose(CustomMiddleware),
          Controller
        )
        break

      // PATCH method
      case 'patch':
        app.patch(
          route.path,
          PagePermissions,
          compose(AuthenticationMiddleware),
          compose(GlobalMiddleware),
          compose(CustomMiddleware),
          Controller
        )
        break

      // DELETE method
      case 'delete':
        app.delete(
          route.path,
          PagePermissions,
          compose(AuthenticationMiddleware),
          compose(GlobalMiddleware),
          compose(CustomMiddleware),
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
