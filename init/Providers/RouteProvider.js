'use strict'

const app = require('express')()
const consola = require('consola')
const roles = require('user-groups-roles')

const AuthenticationMiddleware = require('./AuthenticationProvider')
const FileUpload = require('@helpers/FileUpload')

class Router {
  constructor() {
    this.routes = require('@/init/routes.js')
    this.export(this.routes)
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
    let Middleware = []
    let Prefix = null

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.prefix) {
      Prefix = args.prefix
      app.use(Prefix, [
        AuthenticationMiddleware.isAuthenticated(args.authenticated),
        AuthenticationMiddleware.checkPermission({
          permissions: args.permissions,
          method: args.method,
          path: args.path
        }),
        ...Middleware
      ])
    }

    args.endpoints.forEach((item) => {
      if (args.authenticated) item.authenticated = 1

      if (Prefix) {
        if (item.path === '/') item.path = Prefix
        else item.path = Prefix + item.path
      } else {
        if (args.middleware) {
          if (item.middleware) {
            item.middleware = [].concat(...args.middleware, item.middleware)
          } else {
            item.middleware = [...args.middleware]
          }
        }

        if (typeof args.authenticated === 'boolean')
          item.authenticated = args.authenticated
      }

      if (args.permissions) item.permissions = args.permissions
    })

    this.export(args.endpoints)
  }

  // Methods [GET, POST, PUT, PATCH, DELETE]
  method(args) {
    let Middleware = []
    let Authentication = []
    let Helpers = []

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.permissions) {
      roles.createNewPrivileges([args.path, 'POST'], args.path, false)

      Object.keys(args.permissions).forEach((role) => {
        roles.addPrivilegeToRole(
          role,
          [args.path, 'POST'],
          args.permissions[role]
        )
      })
    }

    if (args.authenticated) {
      if (typeof args.authenticated === 'boolean') {
        Authentication.push(
          AuthenticationMiddleware.isAuthenticated(args.authenticated)
        )
      }

      if (args.permissions) {
        Authentication.push(
          AuthenticationMiddleware.checkPermission({
            permissions: args.permissions,
            method: 'POST',
            path: args.path
          })
        )
      }
    }

    if (args.fileUpload) {
      Helpers.push(
        FileUpload.prepare({
          type: args.fileUpload.type,
          fields: args.fileUpload.fields,
          fileSize: args.fileUpload.fileSize,
          maxCount: args.fileUpload.maxCount
        })
      )
    }

    if (args.validator) {
      const currentValidator = this.validatorExport(args.validator)
      const Validator = async (req, res, next) => {
        try {
          await currentValidator(req.body)
          return next()
        } catch (error) {
          console.log(error)
          return res.status(500).json(error)
        }
      }

      Helpers.push(Validator)
    }

    app[args.method.toLowerCase()](
      args.path,
      [...Authentication, ...Helpers, ...Middleware],
      this.controllerExport(args.handler)
    )
  }

  middlewareExport(middleware) {
    let MiddlewareArray = []
    middleware.filter(Array).forEach((item) => {
      let Middleware = item.split(':')
      let MiddlewareFile = require(`app/Middleware/${
        Middleware[0].split('.')[0]
      }`)
      let MiddlewareMethod = Middleware[0].split('.')[1]

      let MiddlewareParameters = Middleware[1]
      if (MiddlewareParameters) {
        MiddlewareParameters = MiddlewareParameters.split(',')
      }

      if (MiddlewareMethod) {
        if (MiddlewareParameters) {
          Middleware = MiddlewareFile[MiddlewareMethod](...MiddlewareParameters)
        } else {
          Middleware = MiddlewareFile[MiddlewareMethod]
        }
      } else {
        Middleware = MiddlewareFile
      }

      MiddlewareArray.push(Middleware)
    })

    return MiddlewareArray
  }

  controllerExport(controller) {
    let Controller = controller.split('.')
    let ControllerFile = require(`@controllers/${Controller.slice(0, -1).join(
      '.'
    )}`)
    let ControllerMethod = Controller.slice(-1)
    Controller = ControllerFile[ControllerMethod]
    if (!Controller) consola.error(new Error('Controller method is not found.'))
    else return Controller
  }

  validatorExport(validator) {
    let Validator = validator.split('.')
    let ValidatorFile = require(`@validators/${Validator.slice(0, -1).join(
      '.'
    )}`)
    let ValidatorMethod = Validator.slice(-1)
    Validator = ValidatorFile[ValidatorMethod]
    if (!Validator) consola.error(new Error('Validator method is not found.'))
    else return Validator
  }
}

new Router()

module.exports = app
