const consola = require('consola')
const mongoose = require('mongoose')

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

module.exports = mongoose.connect(
  `mongodb://${pxl.config.database.connect.user}:${pxl.config.database.connect.password}@${pxl.config.database.connect.host}:${pxl.config.database.connect.port}/${pxl.config.database.connect.database}`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
)
