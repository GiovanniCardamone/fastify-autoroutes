import fastify from 'fastify'
import fastifyAutoroutes from '../../index'

const server = fastify()

server.register(fastifyAutoroutes, {
  directory: './routes',
})

server.listen(9999)
