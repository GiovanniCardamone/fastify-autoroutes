import fastify from 'fastify'
import autoroutes from '../src'

const errorLabel = autoroutes.errorLabel

describe('Options', () =>{

test('no dir parameters', (t) => {
  const server = fastify()

  server.register(autoroutes)

  server.inject(
    {
      method: 'GET',
      url: '/does-not-really-matter',
    },
    (error) => {
      t.assert(error.message.startsWith(errorLabel))
      t.end()
    }
  )
})

test('ivalid dir parameters', async () => {
  const server = fastify()

  server.register(autoroutes, {
    dir: 33,
  })

  server.inject(
    {
      method: 'GET',
      url: '/does-not-really-matter',
    },
    (error) => {
      t.assert(error.message.startsWith(errorLabel))
      t.end()
    }
  )
})

test('dir does not exists', (t) => {
  const server = fastify()

  server.register(autoroutes, {
    dir: './this-directory-does-not-exists',
  })

  server.inject(
    {
      method: 'GET',
      url: '/does-not-really-matter',
    },
    (error) => {
      t.assert(error.message.startsWith(errorLabel))
      t.end()
    }
  )
})
})
