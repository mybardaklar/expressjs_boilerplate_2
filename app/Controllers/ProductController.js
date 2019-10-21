'use strict'

const multer = require('multer')

const Product = require('../models/Product')

const storage = multer.diskStorage({
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
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
})

class ProductController {
  find(req, res, next) {
    Product.find()
      .select('_id name image price')
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              ...doc._doc,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/api/products/' + doc._id
              }
            }
          })
        }
        console.log(response)
        res.status(200).json(response)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      })
  }

  findOne(req, res, next) {
    const id = req.params.id
    Product.findById(id)
      .select('_id name image price')
      .exec()
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/api/products'
            }
          })
        } else {
          res
            .status(404)
            .json({ message: 'No valid entry found for provided ID' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({ error: err })
      })
  }

  create(req, res, next) {
    res.send({
      method: 'POST',
      ...req.body
    })
  }

  update(req, res, next) {
    res.send({
      method: 'PUT',
      ...req.body
    })
  }

  delete(req, res, next) {
    res.send({
      method: 'DELETE',
      ...req.body
    })
  }
}

module.exports = new ProductController()
