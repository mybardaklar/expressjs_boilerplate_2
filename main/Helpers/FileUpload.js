'use strict'

const path = require('path')
const fs = require('fs')
const aws = require('aws-sdk')
const multer = require('multer')
const slugify = require('slugify')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  Bucket: process.env.AWS_BUCKET_NAME
})

class FileUpload {
  constructor() {
    this.prepare = this.prepare.bind(this)
    this.uploader = this.uploader.bind(this)
    this.upload = this.upload.bind(this)

    this.type = pxl.config.fileUpload.defaults.type || 'single'
    this.fields = pxl.config.fileUpload.defaults.fields || 'file'
    this.fileSize = pxl.config.fileUpload.defaults.fileSize || '5mb'
    this.maxCount = pxl.config.fileUpload.defaults.maxCount || null
  }

  prepare(args) {
    return async (req, res, next) => {
      if (args) {
        this.type = args.type || pxl.config.fileUpload.defaults.type || 'single'
        this.fields =
          args.fields || pxl.config.fileUpload.defaults.fields || 'file'
        this.fileSize =
          args.fileSize || pxl.config.fileUpload.defaults.fileSize || '5mb'
        this.maxCount =
          args.maxCount || pxl.config.fileUpload.defaults.maxCount || null
      }

      req.pxl = { upload: this.upload }

      const prepareMulter = await multer({
        storage: multer.memoryStorage(),
        limits: {
          fileSize: pxl.functions.convertSize(this.fileSize)
        }
      })[this.type](this.fields, this.maxCount)(req, res, next)

      return prepareMulter
    }
  }

  async upload(req) {
    if (req.file) await this.uploader(req.file)
    if (req.files) await this.uploader(req.files)
  }

  uploader(files) {
    if (Array.isArray(files)) {
      // multer.array()
      files.forEach((file) => {
        this.saveFile(file)
      })
    } else if (files.fieldname) {
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

  saveFile(file) {
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

    switch (pxl.config.fileUpload.storage) {
      // Local storage
      case 'local':
        switch (filetype) {
          case 'image':
            filepath = `${process.env.UPLOAD_IMAGE_FOLDER}/${filename}`
            writeStream = fs.createWriteStream(filepath)

            writeStream.on('error', (error) => {
              console.log(error)
            })
            writeStream.end(file.buffer)

            file.filename = filename
            file.filepath = filepath.replace('static', '')
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

            file.filename = filename
            file.filepath = filepath.replace('static', '')
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

            file.filename = filename
            file.filepath = filepath.replace('static', '')
            delete file.originalname
            delete file.buffer
            break
        }
        break

      // AWS S3 storage
      case 'AWS_S3':
        switch (filetype) {
          case 'image':
            s3.upload(
              {
                Bucket: process.env.AWS_UPLOAD_IMAGE_FOLDER,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read'
              },
              (error, data) => {
                if (error) throw error
              }
            )

            file.filename = filename
            file.filepath = `https://${
              process.env.AWS_BUCKET_NAME
            }.s3.amazonaws.com${process.env.AWS_UPLOAD_IMAGE_FOLDER.replace(
              process.env.AWS_BUCKET_NAME,
              ''
            )}/${filename}`
            delete file.originalname
            delete file.buffer
            break

          case 'text':
            s3.upload(
              {
                Bucket: process.env.AWS_UPLOAD_TEXT_FOLDER,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read'
              },
              (error, data) => {
                if (error) throw error
              }
            )

            file.filename = filename
            file.filepath = `https://${
              process.env.AWS_BUCKET_NAME
            }.s3.amazonaws.com${process.env.AWS_UPLOAD_TEXT_FOLDER.replace(
              process.env.AWS_BUCKET_NAME,
              ''
            )}/${filename}`
            delete file.originalname
            delete file.buffer
            break

          default:
            s3.upload(
              {
                Bucket: process.env.AWS_UPLOAD_FOLDER,
                Key: filename,
                Body: file.buffer,
                ACL: 'public-read'
              },
              (error, data) => {
                if (error) throw error
              }
            )

            file.filename = filename
            file.filepath = `https://${
              process.env.AWS_BUCKET_NAME
            }.s3.amazonaws.com${process.env.AWS_UPLOAD_FOLDER.replace(
              process.env.AWS_BUCKET_NAME,
              ''
            )}/${filename}`
            delete file.originalname
            delete file.buffer
            break
        }
        break

      default:
        switch (filetype) {
          case 'image':
            filepath = `${process.env.UPLOAD_IMAGE_FOLDER}/${filename}`
            writeStream = fs.createWriteStream(filepath)

            writeStream.on('error', (error) => {
              console.log(error)
            })
            writeStream.end(file.buffer)

            file.filename = filename
            file.filepath = filepath.replace('static', '')
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

            file.filename = filename
            file.filepath = filepath.replace('static', '')
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

            file.filename = filename
            file.filepath = filepath.replace('static', '')
            delete file.originalname
            delete file.buffer
            break
        }
        break
    }
  }
}

module.exports = new FileUpload()
