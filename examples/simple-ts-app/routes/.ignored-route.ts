import fastify, { FastifyInstance } from 'fastify'
import { Resource } from '../../../dist'

export default (fastify) => {
  return <Resource>{
    get: {
      handler: (request, reply) => {
        reply.send('i am ignored')
      },
    },
  }
}
