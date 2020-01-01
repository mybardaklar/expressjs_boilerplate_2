'use strict'

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const slugify = require('slugify')
const Functions = require('@pxlayer/helpers/Functions')
const pxlayerConfig = require('@/pxlayer.config')

class FileUpload {
  constructor() {
    this.prepare = this.prepare.bind(this)
    this.uploader = this.uploader.bind(this)
    this.upload = this.upload.bind(this)

    this.type = pxlayerConfig.fileUpload.defaults.type || 'single'
    this.fields = pxlayerConfig.fileUpload.defaults.fields || 'file'
    this.fileSize = pxlayerConfig.fileUpload.defaults.fileSize || '5mb'
    this.maxCount = pxlayerConfig.fileUpload.defaults.maxCount || null
  }

  prepare(args) {
    return async (req, res, next) => {
      if (args) {
        this.type =
          args.type || pxlayerConfig.fileUpload.defaults.type || 'single'
        this.fields =
          args.fields || pxlayerConfig.fileUpload.defaults.fields || 'file'
        this.fileSize =
          args.fileSize || pxlayerConfig.fileUpload.defaults.fileSize || '5mb'
        this.maxCount =
          args.maxCount || pxlayerConfig.fileUpload.defaults.maxCount || null
      }

      req.FileUpload = this.upload

      return await multer({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: Functions.convertSize(this.fileSize)
        }
      })[this.type](this.fields, this.maxCount)(req, res, next)
    }
  }

  async upload(req) {
    if (req.file) await this.uploader(req.file)
    if (req.files) await this.uploader(req.files)
  }

  async uploader(files) {
    if (Array.isArray(files)) {
      // multer.array()
      files.forEach((file) => {
        this.saveFile(file)
      })
    } else {
      if (files.fieldname) {
        // multer.single()
        this.saveFile(files)
      } else {
        // multer.fields()
        Object.keys(files).forEach((field) => {
          files[field].forEach((file) => {
            this.saveFile(file)
          })
        })
      }
    }
  }

  saveFile(file) {
    console.log(slugify('ASDA-asdasdsa asdsal işr İ ır'))

    const filetype = file.mimetype.split('/')[0]
    const filename =
      new Date().toISOString().replace(/:/g, '-') +
      '-' +
      slugify(
        path.basename(file.originalname, path.extname(file.originalname)) +
          path.extname(file.originalname)
      )
    let filepath = null
    let writeStream = null

    switch (filetype) {
      case 'image':
        filepath = `${process.env.UPLOAD_IMAGE_FOLDER}/${filename}`
        writeStream = fs.createWriteStream(filepath)

        writeStream.on('error', (error) => {
          console.log(error)
        })
        writeStream.end(file.buffer)

        file.filepath = filepath.replace('static', '')
        file.filename = filename
        delete file.originalname
        delete file.buffer
        break

      case 'text':
        filepath = `${process.env.UPLOAD_TEXT_FOLDER}/${filename}`
        writeStream = fs.createWriteStream(filepath)

        writeStream.on('error', (error) => {
          console.log(error)
        })
        writeStream.end(file.buffer)

        file.filepath = filepath.replace('static', '')
        file.filename = filename
        delete file.originalname
        delete file.buffer
        break

      default:
        filepath = `${process.env.UPLOAD_FOLDER}/${filename}`
        writeStream = fs.createWriteStream(filepath)

        writeStream.on('error', (error) => {
          console.log(error)
        })
        writeStream.end(file.buffer)

        file.filepath = filepath.replace('static', '')
        file.filename = filename
        delete file.originalname
        delete file.buffer
        break
    }
  }
}

module.exports = new FileUpload()
