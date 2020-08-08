import fastify, { FastifyInstance } from 'fastify'

export default (fastify) => {
  return {
    get: {
      handler: (request, reply) => {
        reply.send('hello users')
      },
    },
  }
}
