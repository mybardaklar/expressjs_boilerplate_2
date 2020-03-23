'use strict'

class TestMiddleware {
  index() {
    return (req, res, next) => {
      console.log('Test_1')
      next()
    }
  }
}

module.exports = new TestMiddleware()
