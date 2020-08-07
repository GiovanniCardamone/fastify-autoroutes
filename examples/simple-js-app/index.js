const fastify = require('fastify')

const server = fastify()

server.register(require('../../index'), {
    directory: './routes',
})

server.listen(9999)
