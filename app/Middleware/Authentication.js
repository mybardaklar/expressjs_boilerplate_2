'use strict'

const roles = ['user', 'moderator', 'admin']

module.exports = (req, res, next) => {
  if (res.locals.permission) {
    const permissionIndex = roles.indexOf(res.locals.permission)
    const sliceRoles = roles.slice(permissionIndex)
    const isAuthorized = sliceRoles.filter((role) => role === req.user.role)

    if (isAuthorized.length > 0) {
      return next()
    } else {
      res.status(401).json({
        success: false,
        message: 'Unauthorized user.'
      })
    }
  } else {
    next()
  }
}
