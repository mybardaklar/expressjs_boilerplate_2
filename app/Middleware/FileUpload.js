'use strict'

const multer = require('multer')
const path = require('path')

class FileUpload {
  constructor() {
    this.single = this.single.bind(this)
    this.multi = this.multi.bind(this)

    // define multer's storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let type = file.mimetype
        let typeArray = type.split('/')

        if (typeArray[0] === 'image') cb(null, './static/uploads/image')
        else if (typeArray[0] === 'text') cb(null, './static/uploads/text')
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

    this.single_upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 1024 * 1024 * 5
      }
    }).single('single_upload')

    this.multi_upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 1024 * 1024 * 5
      }
    }).array('multi_upload')
  }

  async single(req, res, next) {
    return this.single_upload(req, res, next)
  }

  async multi(req, res, next) {
    return this.multi_upload(req, res, next)
  }
}

module.exports = new FileUpload()
