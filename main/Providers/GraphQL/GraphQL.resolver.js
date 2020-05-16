'use strict'

const _ = require('lodash')

module.exports = (resolver) => {
  let resolverSplit = _.split(resolver, '.')
  let resolverFile = require(`@pxl/graphql/Resolvers/${resolver}`)

  if (resolverSplit[2]) {
    _.assign(this.resolvers[`${_.capitalize(resolverSplit[1])}`], resolverFile)
  } else {
    if (this.resolvers[`${_.capitalize(resolverSplit[0])}`]) {
      _.assign(
        this.resolvers[`${_.capitalize(resolverSplit[0])}`],
        resolverFile
      )
    } else {
      this.resolvers[`${_.capitalize(resolverSplit[0])}`] = {
        ...resolverFile
      }
    }
  }
}
