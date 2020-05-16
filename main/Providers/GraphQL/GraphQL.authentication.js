'use strict'

const { AuthenticationError } = require('apollo-server')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

const UserModel = require('@pxl/Models/User')

module.exports = async (req) => {
  try {
    req.user = {
      signedIn: false,
      data: null
    }
    const token = await _.split(req.headers.authorization, ' ')[1]

    if (token) {
      const verifyToken = await jwt.verify(token, process.env.APP_KEY)

      if (verifyToken) {
        const user = await UserModel.findById(verifyToken.id).select(
          'id email username photo role createdAt updatedAt'
        )

        if (user) {
          req.user.signedIn = true
          req.user.data = user
        } else {
          throw 'user not found'
        }
      } else {
        throw 'expired token'
      }
    }
  } catch (error) {
    throw new AuthenticationError(error)
  }
}
