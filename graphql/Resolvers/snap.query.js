'use strict'

const SnapModel = pxl.Model('Snap')

module.exports = {
  // Find snap
  async snap(parent, args) {
    const snap = await SnapModel.findById(args.id)
    return snap
  },

  // Find all snaps
  async snaps(parent, args) {
    const snaps = await SnapModel.find().sort({ createdAt: 'desc' })
    return snaps
  }
}
