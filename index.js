'use strict'

require('dotenv-expand')(require('dotenv').config())
require('module-alias/register')

global.pxl = {
  config: require('./pxl.config')
}
require('@pxl/main/Helpers')
require('@pxl/Cron')
require('@pxl/main/server')
