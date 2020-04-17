'use strict'

const roles = require('user-groups-roles')

if (pxl.config.authentication) {
  if (pxl.config.authentication.roles) {
    pxl.config.authentication.roles.forEach((role) => {
      roles.createNewRole(role)
    })
  }
}

module.exports = require('@pxl/Helpers/Authentication')
