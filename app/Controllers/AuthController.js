'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('app/Models/user')
const {
  registerValidation,
  loginValidation
} = require('validations/auth_validation')

class AuthController {
  async signUp(req, res, next) {
    // validate user informations
    const { validation_error } = await registerValidation.validateAsync(
      req.body
    )
    if (validation_error) return res.status(400).json(validation_error)

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword
    })

    try {
      const savedUser = await user.save()

      // create and assign a token and sign in
      const payload = {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
      const token = jwt.sign(payload, process.env.APP_KEY)

      res.status(201).json({
        success: true,
        user: payload,
        token: `Bearer ${token}`
      })
    } catch (error) {
      res.status(500).json(error)
    }
  }

  async signIn(req, res, next) {
    // validate user informations
    const { validation_error } = await loginValidation.validateAsync(req.body)
    if (validation_error) return res.status(400).json(validation_error)

    // checking if the username exists
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.status(400).json({ error: 'User is not found.' })

    // checking password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).json({ error: 'Invalid password.' })

    // create and assign a token
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
    let token = null

    if (req.query.rememberMe) {
      token = jwt.sign(payload, process.env.APP_KEY)
    } else {
      token = jwt.sign(payload, process.env.APP_KEY, {
        expiresIn: '1d'
      })
    }

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      msg: 'Hurry! You are now logged in.'
    })
  }
}

module.exports = new AuthController()
