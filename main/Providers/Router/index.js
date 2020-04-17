'use strict'

const app = require('express')()
const fs = require('fs')
const path = require('path')
const roles = require('user-groups-roles')

const ExportMiddleware = require('./Router.middleware')
const ExportValidator = require('./Router.validator')
const ExportController = require('./Router.controller')

class Router {
  constructor() {
    const routesPath = path.join(process.cwd(), 'app/Routes')
    fs.readdirSync(routesPath).forEach((filepath) => {
      let routeFile = require(`@pxl/Routes/${filepath}`)
      this.export(routeFile)
    })
  }

  export(routes) {
    routes.forEach((route) => {
      switch (route.method) {
        case 'get':
        case 'post':
        case 'put':
        case 'patch':
        case 'delete':
          this.method(route)
          break

        default:
          this.group(route.group)
          break
      }
    })
  }

  // Group HTTP methods
  group(args) {
    args.endpoints.forEach((item) => {
      // Configure the route path
      if (item.path === '/') item.path = args.prefix
      else item.path = args.prefix + item.path

      // Configure the middleware
      if (args.middleware) {
        if (item.middleware) {
          item.middleware.unshift(...args.middleware)
        } else {
          item.middleware = args.middleware
        }
      }

      // Configure the authentication
      if (!item.authenticated && args.authenticated)
        item.authenticated = args.authenticated
      if (!item.permissions && args.permissions)
        item.permissions = args.permissions
    })

    this.export(args.endpoints)
  }

  // Methods [GET, POST, PUT, PATCH, DELETE]
  method(args) {
    const Middleware = []

    // Create the privileges
    if (pxl.config.authentication && pxl.config.authentication.roles) {
      if (args.permissions) {
        roles.createNewPrivileges([args.path, args.method], args.path, false)

        Object.keys(args.permissions).forEach((role) => {
          roles.addPrivilegeToRole(
            role,
            [args.path, args.method],
            args.permissions[role]
          )
        })
      }
    }

    if (pxl.config.authentication && pxl.config.authentication.enabled) {
      if (args.authenticated) {
        if (typeof args.authenticated === 'boolean') {
          Middleware.push(
            pxl.Helpers.Authentication.isAuthenticated(args.authenticated)
          )
        }

        if (pxl.config.authentication && pxl.config.authentication.roles) {
          if (args.permissions) {
            Middleware.push(
              pxl.Helpers.Authentication.checkPermission({
                permissions: args.permissions,
                method: args.method,
                path: args.path
              })
            )
          }
        }
      }
    }

    if (pxl.config.fileUpload && pxl.config.fileUpload.enabled) {
      if (args.upload) {
        Middleware.push([
          pxl.Helpers.FileUpload.middleware({ ...args.upload }),
          pxl.Helpers.FileUpload.body()
        ])
      }
    }

    if (args.validator) Middleware.push(ExportValidator(args.validator)())

    if (args.middleware) Middleware.push(...ExportMiddleware(args.middleware))

    app[args.method.toLowerCase()](
      args.path,
      Middleware,
      ExportController(args.handler)
    )
  }
}

module.exports = {
  init() {
    return new Router()
  },
  routes: app
}
