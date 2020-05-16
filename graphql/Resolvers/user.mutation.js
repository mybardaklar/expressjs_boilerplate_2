'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserModel = pxl.Model('User')

module.exports = {
  // Sign up mutation
  async signUp(parent, args) {
    try {
      const user = await UserModel.findOne({ username: args.data.username })

      if (user) {
        throw new Error('User already exists.')
      }

      const newUser = new UserModel({
        email: args.data.email,
        username: args.data.username,
        password: args.data.password
      })
      await newUser.save()

      return newUser
    } catch (error) {
      throw error
    }
  },

  // Sign in mutation
  async signIn(parent, args, { req }) {
    try {
      // Checking email address
      const doc = await UserModel.findOne({ username: args.data.username })
      if (!doc) {
        throw new Error('Username is not correct. Please try again.')
      }

      // Checking password
      const validPass = await bcrypt.compare(args.data.password, doc.password)
      if (!validPass) {
        throw new Error('Password is not correct. Please try again.')
      }

      // create and assign a token
      const payload = {
        id: doc.id,
        username: doc.username,
        email: doc.email
      }
      const token = await jwt.sign(payload, process.env.APP_KEY)

      console.log(payload)

      return { token }
    } catch (error) {
      throw error
    }
  }
}
