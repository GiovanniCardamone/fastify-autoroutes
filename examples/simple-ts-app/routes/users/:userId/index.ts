import fastify, { FastifyInstance } from 'fastify'
import { Resource } from '../../../../../dist'

interface Params {
  userId: string
}

export default (fastify: FastifyInstance) => {
  return <Resource>{
    get: {
      handler: <Params>(request, reply) => {
        reply.send(`hello user ${request.params.userId}`)
      },
    },
  }
}
