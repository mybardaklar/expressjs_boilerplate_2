'use strict'

require('dotenv-expand')(require('dotenv').config())
require('module-alias/register')

const Server = require('@/init/server')
new Server()
