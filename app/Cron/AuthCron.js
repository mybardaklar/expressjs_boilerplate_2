const cron = require('node-cron')
const UserSchema = pxl.Model('User')

cron.schedule('0 */2 * * *', function() {
  UserSchema.deleteMany({ is_active: false }, (error) => {
    if (error) console.log(error)
  })
})

module.exports = cron
