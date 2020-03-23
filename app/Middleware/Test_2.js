'use strict'

class TestMiddleware2 {
  index(param1, param2) {
    return (req, res, next) => {
      console.log(param1, param2)
      next()
    }
  }
}

module.exports = new TestMiddleware2()
