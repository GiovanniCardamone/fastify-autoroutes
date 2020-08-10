const tap = require('tap')

const fastify = require('fastify')
const autoroutes = require('../dist')

const errorLabel = autoroutes.errorLabel

tap.test('no dir parameters', (t) => {
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

tap.test('ivalid dir parameters', (t) => {
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

tap.test('dir does not exists', (t) => {
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
