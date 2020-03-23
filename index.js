'use strict'

require('dotenv-expand')(require('dotenv').config())
require('module-alias/register')

global.pxl = {
  config: require('./pxlayer.config')
}
require('@pxlayer/main/Globals')
require('@pxlayer/Cron')
require('@pxlayer/main/server')
