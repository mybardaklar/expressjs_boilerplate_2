'use strict'

const consola = require('consola')
const colors = require('colors')

module.exports = (controller) => {
  let Controller = controller.split('.')
  let ControllerFileName = Controller[0]
  let ControllerMethodName = Controller[1]
  let ControllerFile = null

  // Check controller file is exists
  ControllerFile = require(`@pxl/Controllers/${ControllerFileName}`)
  if (!ControllerFile) {
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
