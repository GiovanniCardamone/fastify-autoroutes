const fastify = require('fastify')

const server = fastify()

server.register(require('../../dist/index.js'), {
  dir: './routes',
})

server.listen(9999)
