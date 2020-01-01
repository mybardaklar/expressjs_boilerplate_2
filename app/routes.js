module.exports = [
  // Index endpoints
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
  },

  // Auth endpoints
  {
    group: {
      prefix: '/auth',
      endpoints: [
        {
          method: 'post',
          path: '/signup',
          handler: 'AuthController.signUp',
          validator: 'AuthValidator.signUp'
        },
        {
          method: 'post',
          path: '/signin',
          handler: 'AuthController.signIn',
          validator: 'AuthValidator.signIn'
        }
      ]
    }
  },

  // Category endpoints
  {
    group: {
      prefix: '/categories',
      endpoints: [
        {
          method: 'post',
          path: '/',
          handler: 'CategoryController.create',
          validator: 'CategoryValidator.create'
        },
        {
          method: 'get',
          path: '/',
          handler: 'CategoryController.findAll',
          authenticated: true,
          permissions: {
            admin: true
          }
        }
      ]
    }
  },

  // Owner endpoints
  {
    group: {
      prefix: '/owners',
      endpoints: [
        {
          method: 'post',
          path: '/',
          handler: 'OwnerController.create',
          validator: 'OwnerValidator.create',
          fileUpload: {
            type: 'single',
            fields: 'photo'
          }
        },
        {
          method: 'get',
          path: '/',
          handler: 'OwnerController.findAll'
        }
      ]
    }
  },

  // Product endpoints
  {
    group: {
      prefix: '/products',
      middleware: ['TestMiddleware.index:deneme_1'],
      authenticated: true,
      permissions: {
        admin: true,
        editor: true
      },
      endpoints: [
        {
          method: 'post',
          path: '/',
          handler: 'ProductController.create',
          validator: 'ProductValidator.create',
          fileUpload: {
            type: 'single',
            fields: 'photo'
          }
        },
        {
          method: 'get',
          path: '/',
          handler: 'ProductController.findAll'
        },
        {
          method: 'get',
          path: '/:slug',
          handler: 'ProductController.find'
        },
        {
          method: 'patch',
          path: '/:slug',
          handler: 'ProductController.update',
          validator: 'ProductValidator.update',
          fileUpload: {
            type: 'single',
            fields: 'photo'
          }
        },
        {
          method: 'delete',
          path: '/:slug',
          handler: 'ProductController.delete'
        }
      ]
    }
  }
]
