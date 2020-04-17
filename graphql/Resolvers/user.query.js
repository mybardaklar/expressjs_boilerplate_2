'use strict'

const UserModel = pxl.Model('User')

module.exports = {
  // Find user
  async user(parent, args) {
    const user = await UserModel.findById(args.id)
    return user
  },

  // Find all users
  async users(parent, args) {
    const users = await UserModel.find().sort({ createdAt: 'desc' })
    return users
  }
}
