'use strict'

const path = require('path')
const fs = require('fs')
const aws = require('aws-sdk')
const multer = require('multer')
const slugify = require('slugify')
const consola = require('consola')
const colors = require('colors')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  Bucket: process.env.AWS_BUCKET_NAME
})

class FileUpload {
  constructor() {
    this.middleware = this.middleware.bind(this)
    this.structure = this.structure.bind(this)
    this.customize = this.customize.bind(this)
    this.move = this.move.bind(this)
    this.file = this.file.bind(this)

    this.storage = pxl.config.fileUpload.storage || 'local'
    this.tmpPath = pxl.config.fileUpload.tmpPath || 'static'
    this.path = pxl.config.fileUpload.path || 'uploads'
    this.type = pxl.config.fileUpload.type || 'single'
    this.fields = pxl.config.fileUpload.fields || 'file'
    this.fileSize = pxl.config.fileUpload.fileSize || '5mb'
    this.maxCount = pxl.config.fileUpload.maxCount || null
  }

  // Upload middleware
  middleware(args) {
    return async (req, res, next) => {
      // Check custom configuration
      if (args) {
        this.storage = args.storage || 'local'
        this.tmpPath = args.tmpPath || 'static'
        this.path = args.path || 'uploads'
        this.type = args.type || 'single'
        this.fields = args.fields || 'file'
        this.fileSize = args.fileSize || '5mb'
        this.maxCount = args.maxCount || null
      }

      // Pass custom object to request
      req.pxl = { file: this.file, body: this.body, move: this.move }

      // Make ready multer.js for file upload
      const initMulter = await multer({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: pxl.functions.convertSize(this.fileSize)
        }
      })[this.type](this.fields, this.maxCount)(req, res, next)

      return initMulter
    }
  }

  // Customizing file object
  customize(file) {
    const file_name =
      new Date().toISOString().replace(/:/g, '-') +
      '-' +
      slugify(
        path.basename(file.originalname, path.extname(file.originalname)) +
          path.extname(file.originalname)
      )

    file.name = file_name
    file.path = `/${this.path}`
    file.tmpPath = `/${this.tmpPath}/${this.path}/${file_name}`
    file.fullPath = `/${this.path}/${file_name}`
  }

  // Save file to specified path
  save(file) {
    switch (this.storage) {
      case 'AWS_S3':
        // (not avaliable for now) Working on it
        console.log('Hello AMAZON!')
        break

      // Local as default
      default:
        const writeStream = fs.createWriteStream(
          path.join(process.cwd(), file.tmpPath)
        )
        writeStream.on('error', (error) => {
          console.log(error)
        })
        writeStream.end(file.buffer)
        break
    }
  }

  // Check field structures
  structure(isSaving, files) {
    if (isSaving) {
      // Files are going to be saved
      switch (this.type) {
        case 'single':
          // for Single file
          this.save(files)
          break

        case 'array':
          // for Multiple files
          files.forEach((file) => {
            this.save(file)
          })
          break

        case 'fields':
          // for Multiple files with fields
          Object.keys(files).forEach((field) => {
            files[field].forEach((file) => {
              this.save(file)
            })
          })
          break

        default:
          consola.error(`"${this.type}"`.red + `is not a valid type.`)
          break
      }
    } else {
      // Files are going to be customized
      switch (this.type) {
        case 'single':
          // for Single file
          this.customize(files)
          break

        case 'array':
          // for Multiple files
          files.forEach((file) => {
            this.customize(file)
          })
          break

        case 'fields':
          // for Multiple files with fields
          Object.keys(files).forEach((field) => {
            files[field].forEach((file) => {
              this.customize(file)
            })
          })
          break

        default:
          consola.error(`"${this.type}"`.red + `is not a valid type.`)
          break
      }
    }
  }

  // Pass value to req.body
  body() {
    return async (req, res, next) => {
      this.file(req)
      return next()
    }
  }

  // File upload function
  async file(req) {
    // Check that it is a single file
    if (req.file) await this.structure(false, req.file)

    // Check for multiple files
    if (req.files) await this.structure(false, req.files)

    await this.data(req)
  }

  // Pass files value to req.body
  async data(req) {
    req.body.files = {}

    if (req.file) req.body.files[this.fields] = req.file.fullPath
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.body.files[this.fields] = req.files.map((file) => file.fullPath)
      } else {
        Object.keys(req.files).forEach((fileKey) => {
          let fileObjects = req.files[fileKey].map((file) => file.fullPath)
          req.body.files[fileKey] = fileObjects
        })
      }
    }
  }

  // File upload function
  async move(req) {
    // Check that it is a single file
    if (req.file) await this.structure(true, req.file)

    // Check for multiple files
    if (req.files) await this.structure(true, req.files)
  }
}

module.exports = new FileUpload()
