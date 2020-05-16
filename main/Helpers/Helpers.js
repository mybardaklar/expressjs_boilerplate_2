const Helpers = {}

if (pxl.config.authentication && pxl.config.authentication.enabled)
  Helpers.Authentication = require('@pxl/main/Providers/Authentication')

if (pxl.config.fileUpload && pxl.config.fileUpload.enabled)
  Helpers.FileUpload = require('@pxl/main/Middleware/FileUpload')

module.exports = Helpers
