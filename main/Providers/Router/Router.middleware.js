'use strict'

const consola = require('consola')
const colors = require('colors')

module.exports = (middleware) => {
  const MiddlewareArray = []

  middleware.filter(Array).forEach((item) => {
    let Middleware = item.split(':')
    let MiddlewareFile = null
    let MiddlewareFileName = Middleware[0].split('.')[0]
    let MiddlewareMethod = Middleware[0].split('.')[1]
    let MiddlewareParameters = Middleware[1] ? Middleware[1].split(',') : null

    // Check middleware file is exists
    MiddlewareFile = require(`@pxl/Middleware/${MiddlewareFileName}`)
    if (!MiddlewareFile) {
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
          Middleware = MiddlewareFile[MiddlewareMethod](...MiddlewareParameters)
        }
      }
    }

    MiddlewareArray.push(Middleware)
  })

  return MiddlewareArray
}
