import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, RouteOptions } from 'fastify'

import process from 'process'
import path from 'path'
import fs from 'fs'
import { Interface } from 'readline'

export type ValidMethods =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'PATCH'
  | 'POST'
  | 'PUT'
  | 'OPTIONS'

const validMethods = [
  'delete',
  'get',
  'head',
  'patch',
  'post',
  'put',
  'options',
  'all',
]

export type AnyRoute = Omit<RouteOptions, 'method' | 'url'>

export type DeleteRoute = AnyRoute
export type GetRoute = Omit<AnyRoute, 'body'>
export type HeadRoute = AnyRoute
export type PatchRoute = AnyRoute
export type PostRoute = AnyRoute
export type PutRoute = AnyRoute
export type OptionsRoute = AnyRoute

export interface Resource {
  delete?: DeleteRoute
  get?: GetRoute
  head?: HeadRoute
  patch?: PatchRoute
  post?: PostRoute
  put?: PutRoute
  options?: OptionsRoute
}

interface FastifyAutoroutesOptions {
  dir: string
}

function scan(fastify: FastifyInstance, baseDir: string, current: string) {
  const combined = path.join(baseDir, current)
  const combinedStat = fs.statSync(combined)

  if (combinedStat.isDirectory()) {
    for (const entry of fs.readdirSync(combined)) {
      scan(fastify, baseDir, path.join(current, entry))
    }
  } else if (isAcceptableFile(combined, combinedStat)) {
    autoload(fastify, combined, resourcePathOf(current))
  }
}

function isAcceptableFile(file: string, stat: fs.Stats): boolean {
  return (
    !file.startsWith('.') &&
    !file.startsWith('_') &&
    !file.endsWith('.test.js') &&
    !file.endsWith('.test.ts') &&
    (stat.isFile() || stat.isSymbolicLink())
  )
}

function resourcePathOf(path: string) {
  const url =
    '/' + path.replace('.ts', '').replace('.js', '').replace('index', '')

  return url.endsWith('/') && url.length > 1
    ? url.substring(0, url.length - 1)
    : url.length == 0
    ? '/'
    : url
}

function autoload(fastify: FastifyInstance, fullPath: string, url: string) {
  const module = loadModule(fullPath)

  if (typeof module !== 'function') {
    throw new Error(`module ${fullPath} must export default function`)
  }

  const routes = module(fastify)

  for (const [meth, route] of Object.entries<AnyRoute>(routes)) {
    if (validMethods.includes(meth)) {
      const method: ValidMethods = meth.toUpperCase() as ValidMethods
      console.info('adding', method, url, route)

      fastify.route({
        url,
        method,
        ...route,
      })
    }
  }
}

function loadModule(path: string) {
  try {
    return require(path).default
  } catch (error) {
    throw new Error(`unable to load module ${path}`)
  }
}

export default fastifyPlugin<FastifyAutoroutesOptions>(
  (fastify, options, next) => {
    if (!options.dir) {
      return next(new Error('No autoroutes dir specified'))
    }

    if (typeof options.dir !== 'string') {
      return next(new Error('dir must be a string'))
    }

    const dirPath = path.join(process.cwd(), process.argv[1], '..', options.dir)

    try {
      scan(fastify, dirPath, '')
    } catch (error) {
      console.error(`[ERROR] fastify-autoload: ${error.message}`)
      return next(error)
    } finally {
      return next()
    }
  },
  {
    fastify: '>=3.0.0',
    name: 'fastify-autoroutes',
  }
)
