'use strict'

const app = require('express')()
const consola = require('consola')
const roles = require('user-groups-roles')

const pxlayerConfig = require('@pxlayer/pxlayer.config')
const pxlayerHelpers = {}
if (pxlayerConfig.authentication && pxlayerConfig.authentication.enabled)
  pxlayerHelpers.Authentication = require('@pxlayer/Providers/Authentication')
if (pxlayerConfig.fileUpload && pxlayerConfig.fileUpload.enabled)
  pxlayerHelpers.FileUpload = require('@pxlayer/Helpers/FileUpload')

class Router {
  constructor() {
    this.routes = require('@pxlayer/app/routes.js')
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
    if (pxlayerConfig.authentication && pxlayerConfig.authentication.roles) {
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

    if (pxlayerConfig.authentication && pxlayerConfig.authentication.enabled) {
      if (args.authenticated) {
        if (typeof args.authenticated === 'boolean') {
          Middleware.push(
            pxlayerHelpers.Authentication.isAuthenticated(args.authenticated)
          )
        }

        if (
          pxlayerConfig.authentication &&
          pxlayerConfig.authentication.roles
        ) {
          if (args.permissions) {
            Middleware.push(
              pxlayerHelpers.Authentication.checkPermission({
                permissions: args.permissions,
                method: args.method,
                path: args.path
              })
            )
          }
        }
      }
    }

    if (pxlayerConfig.fileUpload && pxlayerConfig.fileUpload.enabled) {
      if (args.fileUpload) {
        Middleware.push(
          pxlayerHelpers.FileUpload.prepare({
            type: args.fileUpload.type,
            fields: args.fileUpload.fields,
            fileSize: args.fileUpload.fileSize,
            maxCount: args.fileUpload.maxCount
          })
        )
      }
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

      Middleware.push(Validator)
    }

    if (args.middleware)
      Middleware.push(...this.middlewareExport(args.middleware))

    app[args.method.toLowerCase()](
      args.path,
      Middleware,
      this.controllerExport(args.handler)
    )
  }

  // Middleware export
  middlewareExport(middleware) {
    const MiddlewareArray = []
    middleware.filter(Array).forEach((item) => {
      let Middleware = item.split(':')
      const MiddlewareFile = require(`@pxlayer/Middleware/${
        Middleware[0].split('.')[0]
      }`)
      const MiddlewareMethod = Middleware[0].split('.')[1]

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

  // Controller export
  controllerExport(controller) {
    let Controller = controller.split('.')
    const ControllerFile = require(`@pxlayer/Controllers/${Controller.slice(
      0,
      -1
    ).join('.')}`)
    const ControllerMethod = Controller.slice(-1)
    Controller = ControllerFile[ControllerMethod]
    if (!Controller) consola.error(new Error('Controller method is not found.'))
    else return Controller
  }

  // Validator export
  validatorExport(validator) {
    let Validator = validator.split('.')
    const ValidatorFile = require(`@pxlayer/Validators/${Validator.slice(
      0,
      -1
    ).join('.')}`)
    const ValidatorMethod = Validator.slice(-1)
    Validator = ValidatorFile[ValidatorMethod]
    if (!Validator) consola.error(new Error('Validator method is not found.'))
    else return Validator
  }
}

module.exports = {
  init: () => {
    return new Router()
  },
  routes: app
}
