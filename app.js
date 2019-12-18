'use strict'

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')

require('dotenv-expand')(require('dotenv').config())
require('module-alias/register')
require('@providers')['Database']

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))
app.use(passport.initialize())
app.use(require('@providers')['Router'])

module.exports = app
