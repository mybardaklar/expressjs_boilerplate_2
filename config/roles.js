const roles = require('user-groups-roles')

roles.createNewRole('admin')
roles.createNewRole('editor')
roles.createNewRole('seller')
roles.createNewRole('user')

module.exports = roles
