'use strict'

const { AuthenticationError } = require('apollo-server')

const SnapModel = pxl.Model('Snap')

module.exports = {
  // Find snap
  async snap(parent, args, ctx) {
    if (ctx.req.user.signedIn) {
      const snap = await SnapModel.findById(args.id)
      return snap
    } else {
      throw new AuthenticationError('must authenticate')
    }
  },

  // Find all snaps
  async snaps(parent, args) {
    const snaps = await SnapModel.find().sort({ createdAt: 'desc' })
    return snaps
  }
}
