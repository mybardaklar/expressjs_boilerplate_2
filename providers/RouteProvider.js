const app = require('express')()
const consola = require('consola')
const roles = require('user-groups-roles')

const AuthenticationMiddleware = require('./AuthenticationProvider')
const FileUpload = require('helpers/FileUpload')

class Router {
  constructor() {
    this.routes = require('routes.js')
    this.export(this.routes)
  }

  export(routes) {
    routes.forEach((route) => {
      switch (route.method) {
        case 'get':
          this.get(route)
          break

        case 'post':
          this.post(route)
          break

        case 'put':
          this.put(route)
          break

        case 'patch':
          this.patch(route)
          break

        case 'delete':
          this.delete(route)
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

  // GET method
  get(args) {
    let Middleware = []
    let Authentication = []
    let Files = []

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.permissions) {
      roles.createNewPrivileges([args.path, 'GET'], args.path, false)

      Object.keys(args.permissions).forEach((role) => {
        roles.addPrivilegeToRole(
          role,
          [args.path, 'GET'],
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
            method: 'GET',
            path: args.path
          })
        )
      }
    }

    if (args.fileUpload) {
      Files.push(
        FileUpload.upload(
          args.fileUpload.type,
          args.fileUpload.fieldname,
          args.fileUpload.size,
          args.fileUpload.maxCount
        )
      )
    }

    app.get(
      args.path,
      [...Authentication, ...Files, ...Middleware],
      this.controllerExport(args.handler)
    )
  }

  // POST method
  post(args) {
    let Middleware = []
    let Authentication = []
    let Files = []

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
      Files.push(
        FileUpload.upload(
          args.fileUpload.type,
          args.fileUpload.fieldname,
          args.fileUpload.size,
          args.fileUpload.maxCount
        )
      )
    }

    app.post(
      args.path,
      [...Authentication, ...Files, ...Middleware],
      this.controllerExport(args.handler)
    )
  }

  // PUT method
  put(args) {
    let Middleware = []
    let Authentication = []
    let Files = []

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.permissions) {
      roles.createNewPrivileges([args.path, 'PUT'], args.path, false)

      Object.keys(args.permissions).forEach((role) => {
        roles.addPrivilegeToRole(
          role,
          [args.path, 'PUT'],
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
            method: 'PUT',
            path: args.path
          })
        )
      }
    }

    if (args.fileUpload) {
      Files.push(
        FileUpload.upload(
          args.fileUpload.type,
          args.fileUpload.fieldname,
          args.fileUpload.size,
          args.fileUpload.maxCount
        )
      )
    }

    app.put(
      args.path,
      [...Authentication, ...Files, ...Middleware],
      this.controllerExport(args.handler)
    )
  }

  // PATCH method
  patch(args) {
    let Middleware = []
    let Authentication = []
    let Files = []

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.permissions) {
      roles.createNewPrivileges([args.path, 'PATCH'], args.path, false)

      Object.keys(args.permissions).forEach((role) => {
        roles.addPrivilegeToRole(
          role,
          [args.path, 'PATCH'],
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
            method: 'PATCH',
            path: args.path
          })
        )
      }
    }

    if (args.fileUpload) {
      Files.push(
        FileUpload.upload(
          args.fileUpload.type,
          args.fileUpload.fieldname,
          args.fileUpload.size,
          args.fileUpload.maxCount
        )
      )
    }

    app.patch(
      args.path,
      [...Authentication, ...Files, ...Middleware],
      this.controllerExport(args.handler)
    )
  }

  // DELETE method
  delete(args) {
    let Middleware = []
    let Authentication = []
    let Files = []

    if (args.middleware) {
      Middleware = this.middlewareExport(args.middleware)
    }

    if (args.permissions) {
      roles.createNewPrivileges([args.path, 'DELETE'], args.path, false)

      Object.keys(args.permissions).forEach((role) => {
        roles.addPrivilegeToRole(
          role,
          [args.path, 'DELETE'],
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
            method: 'DELETE',
            path: args.path
          })
        )
      }
    }

    if (args.fileUpload) {
      Files.push(
        FileUpload.upload(
          args.fileUpload.type,
          args.fileUpload.fieldname,
          args.fileUpload.size,
          args.fileUpload.maxCount
        )
      )
    }

    app.delete(
      args.path,
      [...Authentication, ...Files, ...Middleware],
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
    let ControllerFile = require(`app/Controllers/${Controller.slice(
      0,
      -1
    ).join('.')}`)
    let ControllerMethod = Controller.slice(-1)
    Controller = ControllerFile[ControllerMethod]
    if (!Controller) consola.error(new Error('Controller method is not found.'))
    else return Controller
  }
}

new Router()

module.exports = app
