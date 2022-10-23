import fastify from 'fastify'
import autoroutes from '../src'

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
describe('Routes', () => {

  test('simple index', async () => {
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

  test('nested routes', async () => {
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

  test('nested routes with trailing slashes', async () => {
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

  test('nested routes with url parameter', async () => {
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

  test(
    'url parameters with : (not on windows)',
    async
      (t) => {
    if(process.platform === 'win32') {
    t.end()
  } else {
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
}
)

test(
  'nested routes with url parameter with trailing slashes',
  async
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

test('example es6 exports default module', async () => {
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
      url: '/',
    },
    (err, res) => {
      t.is(err, null)
      t.is(res.payload, 'get')
      t.end()
    }
  )
})

test(
  'skip routes with starting . charater',
  async
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

test(
  'skip routes with starting _ charater',
  async
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

test(
  'skip routes ending with .test.js or .test.ts',
  async
    (t) => {
  const server = fastify()

    const dir = t.testdir({
    'someJsRoute.test.js': exampleGetRouteDefaultModule,
    'someTsRoute.test.ts': exampleGetRouteDefaultModule,
  })

    server.register(autoroutes, {
    dir: dir,
    log: true,
  })

    server.inject(
    {
      method: 'GET',
      url: '/someJsRoute',
    },
    (err, res) => {
      t.is(res.statusCode, 404)

      server.inject(
        {
          method: 'GET',
          url: '/someTsRoute',
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
})
