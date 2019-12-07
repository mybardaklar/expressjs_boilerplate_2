'use strict'

class TestMiddleware2 {
  index(param1) {
    return (req, res, next) => {
      console.log(param1)
      next()
    }
  }
}

module.exports = new TestMiddleware2()
