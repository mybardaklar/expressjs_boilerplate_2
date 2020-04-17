'use strict'

class IndexController {
  async index(req, res, next) {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Hello world! How is it going?`
    })
  }

  async admin(req, res, next) {
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Hello admin! How is it going?`
    })
  }
}

module.exports = new IndexController()
