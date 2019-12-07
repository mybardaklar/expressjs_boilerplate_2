'use strict'

const multer = require('multer')
const path = require('path')

class FileUpload {
  constructor() {
    this.upload = this.upload.bind(this)

    // define multer's storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let type = file.mimetype
        let typeArray = type.split('/')

        if (typeArray[0] === 'image')
          cb(null, process.env.UPLOAD_FOLDER + process.env.UPLOAD_IMAGE_FOLDER)
        else if (typeArray[0] === 'text')
          cb(null, process.env.UPLOAD_FOLDER + process.env.UPLOAD_TEXT_FOLDER)
        else cb(null, process.env.UPLOAD_FOLDER)
      },
      filename: (req, file, cb) => {
        cb(
          null,
          new Date().toISOString().replace(/:/g, '-') +
            '-' +
            path.basename(file.originalname, path.extname(file.originalname)) +
            path.extname(file.originalname)
        )
      }
    })
  }

  upload(
    type = 'single',
    fieldname = 'file_upload',
    size = 1024 * 1024 * 5,
    maxCount
  ) {
    return async (req, res, next) => {
      console.log(type, fieldname, size)

      try {
        let upload = null

        switch (type) {
          case 'single':
            upload = await multer({
              storage: this.storage,
              limits: {
                fileSize: size
              }
            }).single(fieldname)(req, res, next)
            break

          case 'array':
            upload = await multer({
              storage: this.storage,
              limits: {
                fileSize: size
              }
            }).array(fieldname, maxCount)(req, res, next)
            break

          case 'fields':
            upload = await multer({
              storage: this.storage,
              limits: {
                fileSize: size
              }
            }).fields(fieldname)(req, res, next)
            break

          default:
            break
        }

        return upload
      } catch (error) {
        res.send(error)
      }
    }
  }
}

module.exports = new FileUpload()
