'use strict'

module.exports = {
  mode: 'graphql',

  /*
   * Set the database informations
   * Available database connections: ['mongodb', 'postgres']
   */
  database: {
    connection: process.env.DB_CONNECTION,
    connect: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    }
  },

  /*
   * Set the authentication configurations
   * https://www.npmjs.com/package/passport-jwt
   * https://www.npmjs.com/package/user-groups-roles
   */
  authentication: {
    enabled: true,
    roles: ['admin', 'editor', 'seller', 'user']
  },

  /*
   * Set the email configurations
   * https://www.npmjs.com/package/email-templates
   */
  email: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    ssl: process.env.MAIL_SSL,
    tls: process.env.MAIL_TLS,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS
    }
  },

  /*
   * Set the file upload configurations
   * Available storage connections: ['local', 'AWS_S3']
   * https://www.npmjs.com/package/multer
   * https://www.npmjs.com/package/aws-sdk
   */
  fileUpload: {
    enabled: true,
    storage: 'local',
    tmpPath: 'static',
    path: 'uploads',
    type: 'single',
    fields: 'file',
    fileSize: '5mb'
  }
}
