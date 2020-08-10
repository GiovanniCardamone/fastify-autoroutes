const tap = require('tap')
const path = require('path')

const fastify = require('fastify')
const autoroutes = require('../dist')

const exampleErrorModule = `
  thisSyntaxIsInvalid :(
`

const exampleInvalidModule = `
var whateverIdontCare = 3
`

const errorLabel = autoroutes.errorLabel

tap.test('invalid type routes directory', { saveFixture: false }, (t) => {
  const server = fastify()

  const invalidDir = t.testdir({
    dirAsFile: t.fixture('file', 'routes'),
  })

  server.register(autoroutes, {
    dir: path.join(invalidDir, 'dirAsFile'),
  })

  server.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, res) => {
      t.assert(err.message.startsWith(errorLabel))
      t.end()
    }
  )
})

tap.test('empty routes module', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': '', // empty
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, res) => {
      t.assert(err.message.startsWith(errorLabel))
      t.end()
    }
  )
})

tap.test('modules with error', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': exampleErrorModule,
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err) => {
      t.type(err, SyntaxError)
      t.end()
    }
  )
})

tap.test('modules without valid routes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': exampleInvalidModule,
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, res) => {
      t.assert(err.message.startsWith(errorLabel))
      t.end()
    }
  )
})
