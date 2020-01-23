'use strict'

const roles = require('user-groups-roles')
const pxlayerConfig = require('@pxlayer/pxlayer.config')

if (pxlayerConfig.authentication) {
  if (pxlayerConfig.authentication.roles) {
    pxlayerConfig.authentication.roles.forEach((role) => {
      roles.createNewRole(role)
    })
  }
}

module.exports = require('@pxlayer/Helpers/Authentication')