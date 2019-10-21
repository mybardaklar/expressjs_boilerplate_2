'use strict'

const jwt = require('jsonwebtoken')

const User = require('../models/User')

module.exports = async (req, res, next) => {
  const token = req.header('auth-token')
  //console.log(`\nToken: ${token} \n`)
  console.log(req.cookies)
  if (!token) return res.status(401).send('Access denied.')

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY)

    User.findOne({ _id: verified._id })
      .then((result) => {
        if (!result) {
          return res
            .header('auth-token', null)
            .status(401)
            .send('Access denied.')
        } else {
          req.user = verified
          next()
        }
      })
      .catch((error) => {
        return res
          .header('auth-token', null)
          .status(401)
          .send(error)
      })
  } catch (error) {
    res.status(401).send('Invalid token.')
  }
}
