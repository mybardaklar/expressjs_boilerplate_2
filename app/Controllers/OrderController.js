'use strict'

const Order = require('../models/Order')
const Product = require('../models/Product')

class OrderController {
  find(req, res, next) {
    Order.find()
      .select('quantity product _id')
      .populate('product', 'name price _id')
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              ...doc._doc,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/api/orders/' + doc._id
              }
            }
          })
        }
        res.status(200).json(response)
      })
      .catch((err) => {
        res.status(500).json({
          error: err
        })
      })
  }

  findOne(req, res, next) {
    const id = req.params.id
    Order.findById(id)
      .select('quantity product _id')
      .populate('product', 'name price _id')
      .exec()
      .then((doc) => {
        if (doc) {
          res.status(200).json({
            order: doc,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/api/orders'
            }
          })
        } else {
          res.status(404).json({ message: 'Order not found.' })
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  }

  create(req, res, next) {
    Product.findById(req.body.productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: 'Product not found.'
          })
        }
        const order = new Order({
          quantity: req.body.quantity,
          product: req.body.productId
        })
        return order.save()
      })
      .then((result) => {
        res.status(201).json({
          message: 'Order stored.',
          createdOrder: {
            quantity: result.quantity,
            product: result.product,
            _id: result._id
          },
          request: {
            type: 'GET',
            url: 'http://localhost:3000/api/orders/' + result._id
          }
        })
      })
      .catch((err) => {
        res.status(500).json({
          error: err
        })
      })
  }

  delete(req, res, next) {
    const id = req.params.id
    Order.remove({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: 'Order deleted.',
          request: {
            type: 'POST',
            url: 'http://localhost:3000/api/orders',
            body: {
              quantity: 'Number',
              product: 'ID'
            }
          }
        })
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  }
}

module.exports = new OrderController()
