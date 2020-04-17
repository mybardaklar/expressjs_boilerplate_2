'use strict'

const UserModel = pxl.Model('User')

module.exports = {
  // Find user
  async user(parent, args) {
    const user = await UserModel.findById(parent.user_id)
    return user
  }
}
