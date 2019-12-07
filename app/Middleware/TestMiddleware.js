'use strict'

class TestMiddleware {
  index(param1) {
    return (req, res, next) => {
      console.log(param1)
      next()
    }
  }
}

module.exports = new TestMiddleware()
