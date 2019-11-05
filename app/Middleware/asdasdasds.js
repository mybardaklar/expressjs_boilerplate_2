'use strict'

const multer = require('multer')

class FileUpload {
  constructor() {
    // binding functions
    this.singleFile = this.singleFile.bind(this)

    // define multer's storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './static/uploads/')
      },
      filename: (req, file, cb) => {
        cb(
          null,
          new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
        )
      }
    })

    // define multer's file filter
    this.fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }

    // define multer's upload function
    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: this.fileFilter
    })
  }

  async singleFile(req, res, next) {
    return this.upload.single('uploaded_single_photo')(req, res, next)
  }
}

module.exports = new FileUpload()
