'use strict'

const cron = require('node-cron')
const UserSchema = pxl.Model('User')

cron.schedule('0 */2 * * *', function() {
  UserSchema.find({ is_active: false }, (error, docs) => {
    if (error) console.log(error)

    docs.forEach((doc) => {
      pxl.Mail.template('deleteInactiveAccounts')
        .from('hi@example.com')
        .to('test@example.com')
        .send({
          name: doc.fullname,
          email: doc.email
        })

      UserSchema.findByIdAndRemove(doc._id, (error) => {
        if (error) console.log(error)
      })
    })
  })
})

module.exports = cron
