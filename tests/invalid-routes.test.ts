import fastify from 'fastify'
import path from 'path'
import autoroutes, { ERROR_LABEL } from '../src'
import { mock, restore } from './utils/mock'

const exampleErrorModule = `
  thisSyntaxIsInvalid :(
`

const exampleInvalidModule = `
var whateverIdontCare = 3
`


describe('Invalid Routes', () => {

  beforeEach(() => {
    //
  })

  afterEach(() => {
    restore()
  })

  test('invalid type routes directory', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      dirAsFile: '',
    })

    server.register(autoroutes, {
      dir: path.join(dir, 'dirAsFile'),
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err.message.startsWith(ERROR_LABEL)).toBeTruthy()
        done()
      }
    )
  })

  test('empty routes module', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'index.js': '', // empty
    })

    server.register(autoroutes, {
      dir,
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err.message.startsWith(ERROR_LABEL)).toBeTruthy()
        done()
      }
    )
  })

  test('modules with error', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'index.js': exampleErrorModule,
    })

    server.register(autoroutes, {
      dir,
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err).toBeInstanceOf(Error)
        done()
      }
    )
  })

  test('modules without valid routes', (done) => {
    const server = fastify()

    const dir = mock('dir', {
      'index.js': exampleInvalidModule,
    })

    server.register(autoroutes, {
      dir,
    })

    server.inject(
      {
        method: 'GET',
        url: '/',
      },
      (err, res) => {
        expect(err.message.startsWith(ERROR_LABEL)).toBeTruthy()
        done()
      }
    )
  })
})

