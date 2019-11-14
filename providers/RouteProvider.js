'use strict'

const express = require('express')
const path = require('path')
const glob = require('glob')
const consola = require('consola')
const compose = require('compose-middleware').compose
const AuthenticationMiddleware = require('./AuthenticationProvider')

const app = express()

glob.sync('app/Routes/**/*.json').forEach((file) => {
  let routerFile = require(path.resolve(file))

  routerFile.routes.forEach((route) => {
    let method = route.method.toLowerCase()

    // Custom middleware
    let CustomMiddleware = []
    if (route.middleware) {
      route.middleware.forEach((middleware) => {
        let ControllerFile = require(`app/Middleware/${middleware.path}`)
        let ControllerMethod = middleware.method
        if (middleware.parameters)
          CustomMiddleware.push(
            ControllerFile[ControllerMethod](...middleware.parameters)
          )
        else CustomMiddleware.push(ControllerFile[ControllerMethod])
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
