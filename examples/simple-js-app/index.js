import fastify from 'fastify'
import autoroutes from 'fastify-autoroutes'

const server = fastify()

server.register(autoroutes, {
  dir: './routes',
})

server.listen(9999)
