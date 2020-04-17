'use strict'

const SnapModel = pxl.Model('Snap')

module.exports = {
  // Find all snaps
  async snaps(parent, args) {
    const snaps = await SnapModel.find({ user_id: parent.id }).sort({
      createdAt: 'desc'
    })
    return snaps
  }
}
