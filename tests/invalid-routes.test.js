const tap = require('tap')
const path = require('path')

const fastify = require('fastify')
const autoroutes = require('../dist')

const errorLabel = autoroutes.errorLabel

tap.test('invalid type routes directory', { saveFixture: true }, (t) => {
  const server = fastify()

  const invalidDir = t.testdir({
    'dirAsFile': t.fixture('file', 'routes')
  })

  server.register(autoroutes, {
    dir: path.join(invalidDir, 'dirAsFile'),
    log: false
  })

  server.inject({
    method: 'GET',
    url: '/',
  }, (err, res) => {
      t.assert(err.message.startsWith(errorLabel))
      t.end()
  })

})

tap.test('empty routes module', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': '' // empty
  })

  server.register(autoroutes, {
    dir: dir,
    log: false
  })

  server.inject({
    method: 'GET',
    url: '/',
  }, (err, res) => {
      t.assert(err.message.startsWith(errorLabel))
      t.end()
  })
})
