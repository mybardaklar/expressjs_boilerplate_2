'use strict'

class Generic {
  Model(model) {
    return require(`@pxl/Models/${model}`)
  }

  convertSize(args) {
    const symbol = args.slice(-2).trim()
    const value = args.slice(0, -2).trim()

    switch (symbol) {
      case 'kb':
      case 'KB':
        return 1024 * value

      case 'mb':
      case 'MB':
        return 1024 * 1024 * value

      case 'gb':
      case 'GB':
        return 1024 * 1024 * 1024 * value
    }
  }
}

module.exports = new Generic()
