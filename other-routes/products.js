const express = require('express')
const multer = require('multer')

const verifyToken = require('../middleware/verifyToken')
const Product = require('../models/product')

const router = express.Router()

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

router.get('/', (req, res, next) => {
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
})

router.post('/', verifyToken, upload.single('image'), (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: 'uploads/' + req.file.filename
  })
  product
    .save()
    .then((result) => {
      console.log(result)
      res.status(201).json({
        message: 'Created product successfully.',
        createdProduct: {
          _id: result._id,
          name: result.name,
          image: result.image,
          price: result.price
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/api/products/' + result._id
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select('_id name image price')
    .exec()
    .then((doc) => {
      console.log('From database', doc)
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
})

router.patch('/:productId', verifyToken, (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product updated.',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/api/products/' + id
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.delete('/:productId', verifyToken, (req, res, next) => {
  const id = req.params.productId
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product deleted.',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/api/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

module.exports = router
