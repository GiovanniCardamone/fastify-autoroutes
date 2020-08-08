import fastify, { FastifyInstance } from 'fastify'
import { Resource } from '../../../dist'

export default (fastify) => {
  return {
    get: {
      handler: (request, reply) => {
        reply.send('hello index')
      },
    },
  }
}
