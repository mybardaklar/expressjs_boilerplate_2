'use strict'

const app = require('express')()
const fs = require('fs')
const path = require('path')
const consola = require('consola')
const colors = require('colors')
const roles = require('user-groups-roles')

const pxlayerHelpers = {}
if (pxl.config.authentication && pxl.config.authentication.enabled)
  pxlayerHelpers.Authentication = require('@pxlayer/Providers/Authentication')
if (pxl.config.fileUpload && pxl.config.fileUpload.enabled)
  pxlayerHelpers.FileUpload = require('@pxlayer/Helpers/FileUpload')

class Router {
  constructor() {
    this.routes = []

    const routesPath = path.join(process.cwd(), 'app/Routes')
    fs.readdirSync(routesPath).forEach((filepath) => {
      let routeFile = require(`@pxlayer/Routes/${filepath}`)
      this.routes.push(routeFile[0])
    })

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
            pxlayerHelpers.Authentication.isAuthenticated(args.authenticated)
          )
        }

        if (pxl.config.authentication && pxl.config.authentication.roles) {
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

    if (pxl.config.fileUpload && pxl.config.fileUpload.enabled) {
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
      let Validator = currentValidator()
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
      let MiddlewareFile = null
      let MiddlewareFileName = Middleware[0].split('.')[0]
      let MiddlewareMethod = Middleware[0].split('.')[1]
      let MiddlewareParameters = Middleware[1] ? Middleware[1].split(',') : null

      // Check middleware file is exists
      try {
        MiddlewareFile = require(`@pxlayer/Middleware/${MiddlewareFileName}`)
      } catch (error) {
        consola.error(
          `Cannot find middleware file 'app/Middleware/` +
            `${MiddlewareFileName}`.red +
            `'`
        )
      }

      // If middleware file is exists
      if (MiddlewareFile) {
        Middleware = MiddlewareFile

        // If middleware method is passed
        if (MiddlewareMethod) {
          Middleware = MiddlewareFile[MiddlewareMethod]()

          // If middleware method has parameters
          if (MiddlewareParameters) {
            Middleware = MiddlewareFile[MiddlewareMethod](
              ...MiddlewareParameters
            )
          }
        }
      }

      MiddlewareArray.push(Middleware)
    })

    return MiddlewareArray
  }

  // Controller export
  controllerExport(controller) {
    let Controller = controller.split('.')
    let ControllerFileName = Controller[0]
    let ControllerMethodName = Controller[1]
    let ControllerFile = null

    // Check controller file is exists
    try {
      ControllerFile = require(`@pxlayer/Controllers/${ControllerFileName}`)
    } catch (error) {
      consola.error(
        `Cannot find controller file 'app/Controllers/` +
          `${ControllerMethodName}`.red +
          `'`
      )
    }

    // If controller file is exists
    if (ControllerFile) {
      Controller = ControllerFile[ControllerMethodName]

      // Check controller method is passed
      if (!Controller)
        consola.error(
          `Cannot find controller method '${controller
            .split('.')
            .slice(0, -1)
            .join('.') + '.'}` +
            `${ControllerMethod}`.red +
            `'`
        )
      else return Controller
    }
  }

  // Validator export
  validatorExport(validator) {
    let Validator = validator.split('.')
    let ValidatorFileName = Validator[0]
    let ValidatorMethodName = Validator[1]
    let ValidatorFile = null

    // Check validator file is exists
    try {
      ValidatorFile = require(`@pxlayer/Validators/${ValidatorFileName}`)
    } catch (error) {
      consola.error(
        `Cannot find validator file 'app/Validators/` +
          `${ValidatorFileName}`.red +
          `'`
      )
    }

    // If validator file is exists
    if (ValidatorFile) {
      Validator = ValidatorFile[ValidatorMethodName]

      // Check validator method is passed
      if (!Validator)
        consola.error(
          `Cannot find validator method '${ValidatorFileName + '.'}` +
            `${ValidatorMethodName}`.red +
            `'`
        )
      else return Validator
    }
  }
}

module.exports = {
  init: () => {
    return new Router()
  },
  routes: app
}
