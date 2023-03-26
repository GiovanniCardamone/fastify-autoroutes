import fastify from 'fastify'
import autoroutes from '../src'
import { mock, restore } from './utils/mock'

const exampleGetRoute = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        return reply.send('get')
      }
    }
  }
}
`

const exampleGetRouteUrlParam = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        return reply.send(request.params.PARAM)
      }
    }
  }
}
`

const exampleGetRouteJSONParam = `module.exports = function (server) {
  return {
    get: {
      handler: function (request, reply) {
        return reply.send(JSON.stringify(request.params))
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
        return reply.send('get')
      }
    }
  };
};
`
describe('Routes', () => {

  beforeEach(() => {
    //
  })

  afterEach(() => {
    restore()
  })

  test('simple index', (done) => {
    const server = fastify()

    const dir = mock('routes', {
      'index.js': exampleGetRoute,
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe('get')
        done()
      }
    )
  })

  test('nested routes', (done) => {
    const server = fastify()

    const dir = mock('routes', {
      users: {
        'foo.js': exampleGetRoute,
      },
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/users/foo',
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe('get')
        done()
      }
    )
  })

  test('nested routes with trailing slashes', (done) => {
    const server = fastify()

    const dir = mock('routes', {
      users: {
        foo: {
          'index.js': exampleGetRoute,
        },
      },
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/users/foo/',
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe('get')
        done()
      }
    )
  })

  test('nested routes with url parameter', (done) => {
    const server = fastify()

    const dir = mock('routes', {

      users: {
        '{PARAM}.js': exampleGetRouteUrlParam,
      },
    })

    server.register(autoroutes, {
      dir
    })

    const userId = 'foo'

    server.inject(
      {
        method: 'GET',
        url: `/users/${userId}`,
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe(userId)
        done()
      }
    )
  })

  test(
    'url parameters with : (not on windows)', (done) => {
      if (process.platform === 'win32') {
        done()
      } else {
        const server = fastify()

        const dir = mock('routes', {
          users: {
            '{USERID}.js': exampleGetRouteJSONParam,
            '{USERID}': {
              'index.js': exampleGetRouteJSONParam,
            },
          },
        })

        server.register(autoroutes, {
          dir,
        })

        const USERID = 'foo'

        server.inject(
          {
            method: 'GET',
            url: `/users/${USERID}`,
          },
          (err, res) => {
            expect(err).toBe(null)
            expect(JSON.parse(res.payload).USERID).toBe(USERID)

            server.inject(
              {
                method: 'GET',
                url: `/users/${USERID}/`,
              },
              (err, res) => {
                expect(err).toBe(null)
                expect(JSON.parse(res.payload).USERID).toBe(USERID)
                done()
              }
            )
          }
        )
      }
    }
  )

  test(
    'nested routes with url parameter with trailing slashes', (done) => {
      const server = fastify()

      const dir = mock('dir', {
        users: {
          '{PARAM}': {
            'index.js': exampleGetRouteUrlParam,
          },
        },
      })

      server.register(autoroutes, {
        dir,
      })

      const userId = 'foo'

      server.inject(
        {
          method: 'GET',
          url: `/users/${userId}/`,
        },
        (err, res) => {
          expect(err).toBe(null)
          expect(res.payload).toBe(userId)
          done()
        }
      )
    }
  )

  test('example es6 exports default module', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'index.js': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe('get')
        done()
      }
    )
  })

  test(
    'skip routes with starting . charater', (done) => {
      const server = fastify()

      const dir = mock('dir', {

        '.hello.js': exampleGetRouteDefaultModule,
      })

      server.register(autoroutes, {
        dir,
      })

      server.inject(
        {
          method: 'GET',
          url: '/hello',
        },
        (err, res) => {
          expect(res.statusCode).toBe(404)

          server.inject(
            {
              method: 'GET',
              url: '/.hello',
            },
            (err, res) => {
              expect(res.statusCode).toBe(404)

              done()
            }
          )
        }
      )
    }
  )

  test(
    'skip routes with starting _ charater', (done) => {
      const server = fastify()

      const dir = mock('dir', {
        '_hello.js': exampleGetRouteDefaultModule,

      })

      server.register(autoroutes, {
        dir
      })

      server.inject(
        {
          method: 'GET',
          url: '/hello',
        },
        (err, res) => {
          expect(res.statusCode).toBe(404)

          server.inject(
            {
              method: 'GET',
              url: '/_hello',
            },
            (err, res) => {
              expect(res.statusCode).toBe(404)
              done()
            }
          )
        }
      )
    }
  )

  test('skip routes ending with .test.js or .test.ts', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'someJsRoute.test.js': exampleGetRouteDefaultModule,
      'someTsRoute.test.ts': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/someJsRoute',
      },
      (err, res) => {
        expect(res.statusCode).toBe(404)

        server.inject(
          {
            method: 'GET',
            url: '/someTsRoute',
          },
          (err, res) => {
            expect(res.statusCode).toBe(404)
            done()
          }
        )
      }
    )
  })

  
  test('skip routes ending with .d.ts', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'someTsRoute.d.ts': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/someTsRoute',
      },
      (err, res) => {
        expect(res.statusCode).toBe(404)
        done()
      }
    )
  })

  
  test('skip routes match ignorePattern', (done) => {
    const server = fastify()

    const ignorePattern = /ignore/
    const dir = mock('dir', {
      'someTsRoute.ignore.ts': exampleGetRouteDefaultModule,
    })

    server.register(autoroutes, {
      dir,
      ignorePattern
    })

    server.inject(
      {
        method: 'GET',
        url: '/someTsRoute',
      },
      (err, res) => {
        expect(res.statusCode).toBe(404)
        done()
      }
    )
  })

  test('expect route /status to work', (done) => {
    const server = fastify()

    const dir = mock('routes', {
      a: {'status.js': exampleGetRoute, }
    })

    server.register(autoroutes, {
      dir
    })

    server.inject(
      {
        method: 'GET',
        url: '/a/status',
      },
      (err, res) => {
        expect(err).toBe(null)
        expect(res.payload).toBe('get')
        done()
      }
    )
  })
})
