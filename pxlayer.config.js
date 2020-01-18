'use strict'

module.exports = {
  isItRestfulAPI: true,

  /*
   * Set the database informations
   * Available database clients: ['MongoDB']
   */
  database: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    }
  },

  /*
   * Set the authentication configurations
   */
  authentication: {
    enabled: true,
    roles: ['admin', 'editor', 'seller', 'user']
  },

  fileUpload: {
    enabled: true,
    storage: 'AWS_S3',
    defaults: {
      type: 'single',
      fields: 'file',
      fileSize: '5mb'
    }
  }
}
