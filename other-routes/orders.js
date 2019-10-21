const express = require('express')
const passport = require('passport')

const OrderController = require('../controllers/OrderController')

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  OrderController.get_all
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  OrderController.create
)

router.get(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  OrderController.get_one
)

router.delete(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  OrderController.delete
)

module.exports = router
