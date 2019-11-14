'use strict'

const consola = require('consola')
const mongoose = require('mongoose')

const database = require('config/database')

module.exports = mongoose
  .connect(
    `mongodb://${database.mongodb.connection.user}:${database.mongodb.connection.password}@${database.mongodb.connection.host}:${database.mongodb.connection.port}/${database.mongodb.connection.database}`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    consola.ready({
      message: `MongoDB successfully connected.`,
      badge: true
    })
  })
  .catch((error) => {
    console.log(error)
  })
