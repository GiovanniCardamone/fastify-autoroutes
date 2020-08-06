import fastify, { FastifyInstance } from 'fastify'

import { Rest } from 'fastify-autoroutes'

export default (fastify: FastifyInstance) => {
  return <Rest>{
    get: {},
  }
}
