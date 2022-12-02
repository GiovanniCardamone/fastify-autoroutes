import fastify from 'fastify'
import autoroutes, { ERROR_LABEL } from '../src'
import { restore } from './utils/mock'


describe('Options', () => {

  beforeEach(() => {
    //
  })

  afterEach(() => {
    restore()
  })

  test('no dir parameters', (done) => {
    const server = fastify()

    server.register(autoroutes)

    server.inject(
      {
        method: 'GET',
        url: '/does-not-really-matter',
      },
      (error) => {
        expect(error.message.startsWith(ERROR_LABEL)).toBeTruthy()
        done()
      }
    )
  })

  test('invalid dir parameters', (done) => {
    const server = fastify()

    // @ts-expect-error not valid 33 as dir
    server.register(autoroutes, {
      dir: 33,
    })

    server.inject(
      {
        method: 'GET',
        url: '/does-not-really-matter',
      },
      (error, res) => {
        console.log({ error, res })
        expect(error).not.toBe(undefined)
        done()
      }
    )
  })

  test('dir does not exists', (done) => {
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
        expect(error.message.startsWith(ERROR_LABEL)).toBeTruthy()
        done()
      }
    )
  })
})
