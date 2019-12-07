module.exports = [
  // index endpoints
  {
    method: 'get',
    path: '/',
    handler: 'IndexController.homepage'
  },

  // movie endpoints
  {
    group: {
      prefix: '/dashboard',
      middleware: [
        'TestMiddleware.index:TestMiddleware_1',
        'TestMiddleware2.index:TestMiddleware_2'
      ],
      authenticated: true,
      permissions: {
        admin: true
      },
      endpoints: [
        {
          method: 'get',
          path: '/uploads',
          handler: 'dashboard/UploadController.index',
          permissions: {
            moderator: true,
            admin: true
          }
        },
        {
          method: 'get',
          path: '/others',
          handler: 'dashboard/UploadController.index'
        },
        {
          method: 'post',
          path: '/upload',
          handler: 'dashboard/UploadController.create',
          authenticated: true,
          permissions: {
            moderator: true,
            admin: true
          },
          middleware: ['FileUpload.upload:single,poster']
        }
      ]
    }
  },

  // auth endpoints
  {
    group: {
      prefix: '/auth',
      endpoints: [
        {
          method: 'post',
          path: '/sign-up',
          handler: 'AuthController.signUp'
        },
        {
          method: 'post',
          path: '/sign-in',
          handler: 'AuthController.signIn'
        }
      ]
    }
  }
]
