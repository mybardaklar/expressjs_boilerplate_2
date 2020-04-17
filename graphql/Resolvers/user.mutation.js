'use strict'

const UserModel = pxl.Model('User')

module.exports = {
  // Create user
  async createUser(parent, args) {
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
  }
}
