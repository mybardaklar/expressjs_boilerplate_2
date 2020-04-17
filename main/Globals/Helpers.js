const Helpers = {}

if (pxl.config.authentication && pxl.config.authentication.enabled)
  Helpers.Authentication = require('@pxl/Providers/Authentication')

if (pxl.config.fileUpload && pxl.config.fileUpload.enabled)
  Helpers.FileUpload = require('@pxl/Helpers/FileUpload')

module.exports = Helpers
