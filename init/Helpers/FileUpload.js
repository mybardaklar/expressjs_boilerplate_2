'use strict'

const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Functions = require('@helpers/Functions')

class FileUpload {
  constructor() {
    this.prepare = this.prepare.bind(this)
    this.uploader = this.uploader.bind(this)
    this.upload = this.upload.bind(this)

    this.type = 'single'
    this.fields = 'files'
    this.fileSize = '5mb'
    this.maxCount = null
  }

  prepare(args) {
    return async (req, res, next) => {
      if (args) {
        this.type = args.type || 'single'
        this.fields = args.fields || 'files'
        this.fileSize = args.fileSize || '5mb'
        this.maxCount = args.maxCount || null
      }

      req.fileUpload = this.upload

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
    const filetype = file.mimetype.split('/')[0]
    const filename =
      new Date().toISOString().replace(/:/g, '-') +
      '-' +
      path.basename(file.originalname, path.extname(file.originalname)) +
      path.extname(file.originalname)
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
