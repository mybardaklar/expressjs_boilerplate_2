const Helpers = {}

if (pxl.config.authentication && pxl.config.authentication.enabled)
  Helpers.Authentication = require('@pxlayer/Providers/Authentication')

if (pxl.config.fileUpload && pxl.config.fileUpload.enabled)
  Helpers.FileUpload = require('@pxlayer/Helpers/FileUpload')

module.exports = Helpers
