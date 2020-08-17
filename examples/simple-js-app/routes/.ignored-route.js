export default (fastify) => {
  return {
    get: {
      handler: (request, reply) => {
        reply.send('i am ignored')
      },
    },
  }
}
