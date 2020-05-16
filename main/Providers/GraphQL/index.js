'use strict'

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const { ApolloServer } = require('apollo-server-express')
const { importSchema } = require('graphql-import')

const ExportResolver = require('./GraphQL.resolver')
const Authentication = require('./GraphQL.authentication')

class GraphQLProvider {
  constructor() {
    this.resolvers = {
      Query: {},
      Mutation: {}
    }
    this.server = null

    const resolversPath = path.join(process.cwd(), 'graphql/Resolvers')
    fs.readdirSync(resolversPath).forEach((resolver) => {
      let resolverSplit = _.split(resolver, '.')
      let resolverFile = require(`@pxl/graphql/Resolvers/${resolver}`)

      if (resolverSplit[2]) {
        _.assign(
          this.resolvers[`${_.capitalize(resolverSplit[1])}`],
          resolverFile
        )
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
    })
  }

  init() {
    const schemaPath = path.join(process.cwd(), 'graphql/Types/schema.graphql')

    this.server = new ApolloServer({
      typeDefs: importSchema(schemaPath),
      resolvers: this.resolvers,
      context: async ({ req }) => {
        await Authentication(req)

        return {
          req
        }
      }
    })
  }
}

module.exports = new GraphQLProvider()
