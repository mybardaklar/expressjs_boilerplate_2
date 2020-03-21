module.exports = [
  {
    group: {
      prefix: '/upload',
      authenticated: true,
      permissions: {
        admin: true
      },
      endpoints: [
        {
          method: 'get',
          path: '/',
          handler: 'IndexController.homepage',
          authenticated: true,
          permissions: {
            admin: true
          }
        },
        {
          method: 'post',
          path: '/',
          handler: 'IndexController.upload',
          validator: 'IndexValidator.create',
          authenticated: true,
          fileUpload: {
            type: 'single',
            fields: 'photo'
          }
        }
      ]
    }
  }
]
