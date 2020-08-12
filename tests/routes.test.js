const tap = require('tap')

const fastify = require('fastify')
const autoroutes = require('../dist')
const errorLabel = autoroutes.errorLabel

const exampleGetRoute = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send('get')
      }
    }
  }
}
`

const exampleGetRouteUrlParam = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send(request.params.PARAM)
      }
    }
  }
}
`

const exampleGetRouteJSONParam = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send(JSON.stringify(request.params))
      }
    }
  }
}
`

const exampleGetRouteDefaultModule = `
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return {
    get: {
      handler: function (request, reply) {
        reply.send('get')
      }
    }
  };
};
`

tap.test('simple index', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': exampleGetRoute,
  })

  server.register(autoroutes, {
    dir: dir,
    log: false,
  })

  server.inject(
    {
      method: 'GET',
      url: '/',
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
    }
  )
})

tap.test('nested routes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    users: {
      'foo.js': exampleGetRoute,
    },
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: '/users/foo',
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
    }
  )
})

tap.test('nested routes with trailing slashes', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    users: {
      foo: {
        'index.js': exampleGetRoute,
      },
    },
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: '/users/foo/',
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
    }
  )
})

tap.test('nested routes with url parameter', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    users: {
      '{PARAM}.js': exampleGetRouteUrlParam,
    },
  })

  server.register(autoroutes, {
    dir: dir,
  })

  const userId = 'foo'

  server.inject(
    {
      method: 'GET',
      url: `/users/${userId}`,
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, userId)
      t.end()
    }
  )
})

tap.test(
  'url parameters with : (not on windows)',
  { saveFixture: false },
  (t) => {
    if (process.platform === 'win32') {
      t.end()
    }

    const server = fastify()

    const dir = t.testdir({
      users: {
        '{USERID}.js': exampleGetRouteJSONParam,
        '{USERID}': {
          'index.js': exampleGetRouteJSONParam,
        },
      },
    })

    server.register(autoroutes, {
      dir: dir,
    })

    const USERID = 'foo'

    server.inject(
      {
        method: 'GET',
        url: `/users/${USERID}`,
      },
      (err, res) => {
        t.is(err, null)
        t.is(JSON.parse(res.payload).USERID, USERID)

        server.inject(
          {
            method: 'GET',
            url: `/users/${USERID}/`,
          },
          (err, res) => {
            t.is(err, null)
            t.is(JSON.parse(res.payload).USERID, USERID)
            t.end()
          }
        )
      }
    )
  }
)

tap.test(
  'nested routes with url parameter with trailing slashes',
  { saveFixture: false },
  (t) => {
    const server = fastify()

    const dir = t.testdir({
      users: {
        '{PARAM}': {
          'index.js': exampleGetRouteUrlParam,
        },
      },
    })

    server.register(autoroutes, {
      dir: dir,
    })

    const userId = 'foo'

    server.inject(
      {
        method: 'GET',
        url: `/users/${userId}/`,
      },
      (err, res) => {
        t.is(err, null)
        t.is(res.payload, userId)
        t.end()
      }
    )
  }
)

tap.test('example es6 exports default module', { saveFixture: false }, (t) => {
  const server = fastify()

  const dir = t.testdir({
    'index.js': exampleGetRouteDefaultModule,
  })

  server.register(autoroutes, {
    dir: dir,
  })

  server.inject(
    {
      method: 'GET',
      url: `/`,
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
    }
  )
})

tap.test(
  'skip routes with starting . charater',
  { saveFixture: false },
  (t) => {
    const server = fastify()

    const dir = t.testdir({
      '.hello.js': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir: dir,
    })

    server.inject(
      {
        method: 'GET',
        url: '/hello',
      },
      (err, res) => {
        t.is(res.statusCode, 404)

        server.inject(
          {
            method: 'GET',
            url: '/.hello',
          },
          (err, res) => {
            t.is(res.statusCode, 404)

            t.end()
          }
        )
      }
    )
  }
)

tap.test(
  'skip routes with starting _ charater',
  { saveFixture: false },
  (t) => {
    const server = fastify()

    const dir = t.testdir({
      '_hello.js': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir: dir,
      log: true,
    })

    server.inject(
      {
        method: 'GET',
        url: '/hello',
      },
      (err, res) => {
        t.is(res.statusCode, 404)

        server.inject(
          {
            method: 'GET',
            url: '/_hello',
          },
          (err, res) => {
            t.is(res.statusCode, 404)
            t.end()
          }
        )
      }
    )
  }
)
