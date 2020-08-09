const tap = require('tap')

const fastify = require('fastify')
const autoroutes = require('../dist')

const exampleGetRoute =
`module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send('get')
      }
    }
  }
}
`

const exampleGetRouteUrlParam =
`module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send(request.params.PARAM)
      }
    }
  }
}
`

tap.test('simple index', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': exampleGetRoute
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  server.inject({
    method: 'GET',
    url: '/',
  }, (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
  })
})

tap.test('nested routes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'users': {
      'foo.js': exampleGetRoute
    }
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  server.inject({
    method: 'GET',
    url: '/users/foo',
  }, (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
  })
})

tap.test('nested routes with trailing slashes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'users': {
      'foo': {
        'index.js': exampleGetRoute
      }
    }
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  server.inject({
    method: 'GET',
    url: '/users/foo/',
  }, (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
  })
})

tap.test('nested routes with url parameter', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'users': {
      '{PARAM}.js': exampleGetRouteUrlParam
    }
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  const userId = 'foo'

  server.inject({
    method: 'GET',
    url: `/users/${userId}`,
  }, (err, res) => {
      t.is(err, null)
      t.is(res.payload, userId)
      t.end()
  })

})

tap.test('nested routes with url parameter with trailing slashes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'users': {
      '{PARAM}': {
        'index.js': exampleGetRouteUrlParam
      }
    }
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  const userId = 'foo'

  server.inject({
    method: 'GET',
    url: `/users/${userId}/`,
  }, (err, res) => {
      t.is(err, null)
      t.is(res.payload, userId)
      t.end()
  })

})
