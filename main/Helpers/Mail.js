'use strict'

const Email = require('email-templates')

class Mail {
  constructor() {
    this.template_str = null
    this.from_str = null
    this.to_str = null

    this.email = new Email({
      send: true,
      transport: {
        host: pxl.config.email.host,
        port: pxl.config.email.port,
        ssl: pxl.config.email.ssl,
        tls: pxl.config.email.tls,
        auth: pxl.config.email.auth
      }
    })
  }

  template(template) {
    this.template_str = template
    return this
  }

  from(from) {
    this.from_str = from
    return this
  }

  to(to) {
    this.to_str = to
    return this
  }

  send(locals) {
    this.email.send({
      template: this.template_str,
      message: {
        from: this.from_str,
        to: this.to_str
      },
      locals: locals
    })
  }
}

module.exports = new Mail()
