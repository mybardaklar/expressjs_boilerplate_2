'use strict'

const consola = require('consola')
const mongoose = require('mongoose')
const pxlayerConfig = require('@pxlayer/pxlayer.config')

mongoose.Promise = Promise
mongoose.connection.on('connected', () => {
  consola.ready({
    message: 'MongoDB connection established.',
    badge: true
  })
})
mongoose.connection.on('reconnected', () => {
  consola.ready({
    message: 'MongoDB connection restablished.',
    badge: true
  })
})
mongoose.connection.on('disconnected', () => {
  consola.warn({
    message: 'MongoDB connection disconnected.',
    badge: true
  })
})
mongoose.connection.on('close', () => {
  consola.error({
    message: 'MongoDB connection closed.',
    badge: true
  })
})
mongoose.connection.on('error', (error) => {
  console.error(error)
})

module.exports = async () => {
  try {
    return await mongoose.connect(
      `mongodb://${pxlayerConfig.database.connection.user}:${pxlayerConfig.database.connection.password}@${pxlayerConfig.database.connection.host}:${pxlayerConfig.database.connection.port}/${pxlayerConfig.database.connection.database}`,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      }
    )
  } catch (error) {
    console.log(error)
  }
}
