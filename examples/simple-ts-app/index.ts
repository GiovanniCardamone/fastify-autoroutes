import fastify from 'fastify'
import fastifyAutoroutes from '../../dist/index'

const server = fastify()

server.register(fastifyAutoroutes, {
  dir: './routes',
})

server.listen(9999)
