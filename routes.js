module.exports = [
  // Index endpoints
  {
    method: 'get',
    path: '/',
    handler: 'IndexController.homepage',
    authenticated: true,
    permissions: {
      admin: true
    }
  },

  // Auth endpoints
  {
    group: {
      prefix: '/auth',
      endpoints: [
        {
          method: 'post',
          path: '/signup',
          handler: 'AuthController.signUp'
        },
        {
          method: 'post',
          path: '/signin',
          handler: 'AuthController.signIn'
        }
      ]
    }
  }
]
