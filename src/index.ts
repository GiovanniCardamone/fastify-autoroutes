import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance, FastifyRequest, RouteOptions } from 'fastify'
import glob from 'glob-promise'

import process from 'process'
import path from 'path'
import fs from 'fs'

export const ERROR_LABEL = 'fastify-autoload'

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
]

export type AnyRoute = Omit<RouteOptions, 'method' | 'url'>

export type DeleteRoute = AnyRoute
export type GetRoute = Omit<AnyRoute, 'body'>
export type HeadRoute = AnyRoute
export type PatchRoute = AnyRoute
export type PostRoute = AnyRoute
export type PutRoute = AnyRoute
export type OptionsRoute = AnyRoute

interface Security {
  [key: string]: string[]
}

interface StrictAnyRoute extends AnyRoute {
  schema: {
    summary?: string
    description?: string
    security?: Security[]
    tags?: string[]
    consumes?: string[]
    produces?: string[]
    body?: any
    querystring?: any
    params?: any
    headers?: any
    response?: { [key: number]: any }
  }
}

export type StrictDeleteRoute = StrictAnyRoute
export type StrictGetRoute = Omit<StrictAnyRoute, 'body'>
export type StrictHeadRoute = StrictAnyRoute
export type StrictPatchRoute = StrictAnyRoute
export type StrictPostRoute = StrictAnyRoute
export type StrictPutRoute = StrictAnyRoute
export type StrictOptionsRoute = StrictAnyRoute

export interface Resource {
  delete?: DeleteRoute
  get?: GetRoute
  head?: HeadRoute
  patch?: PatchRoute
  post?: PostRoute
  put?: PutRoute
  options?: OptionsRoute
}

export interface StrictResource {
  delete?: StrictDeleteRoute
  get?: StrictGetRoute
  head?: StrictHeadRoute
  patch?: StrictPatchRoute
  post?: StrictPostRoute
  put?: StrictPutRoute
  options?: StrictOptionsRoute
}

interface FastifyAutoroutesOptions {
  dir?: string
}

export default fastifyPlugin<FastifyAutoroutesOptions>(
  async (
    fastify: FastifyInstance,
    options: FastifyAutoroutesOptions,
    next: CallableFunction
  ) => {
    const { dir: dir } = { ...options, dir: options.dir || './routes' }

    let dirPath: string

    if (path.isAbsolute(dir)) {
      dirPath = dir
    } else if (path.isAbsolute(process.argv[1])) {
      dirPath = path.join(process.argv[1], dir)
    } else {
      dirPath = path.join(process.cwd(), process.argv[1], dir)
    }

    if (!fs.existsSync(dirPath)) {
      return next(new Error(`${ERROR_LABEL} dir ${dirPath} does not exists`))
    }

    if (!fs.statSync(dirPath).isDirectory()) {
      return next(
        new Error(`${ERROR_LABEL} dir ${dirPath} must be a directory`)
      )
    }

    const routes = await glob(`${dirPath}/**/[!.]*.{ts,js}`)
    const routesModules: Record<string, StrictResource> = {}

    // console.log({ routes })

    for (const route of routes) {
      let routeName = route
        .replace(dirPath, '')
        .replace('.js', '')
        .replace('.ts', '')
        .replace('index', '')
        .split('/')
        .map((part) => part.replace(/{(.+)}/g, ':$1'))
        .join('/')

      routeName = !routeName ? '/' : routeName

      // console.log({ routeName })

      routesModules[routeName] = loadModule(routeName, route)(fastify)
    }

    for (const [url, module] of Object.entries(routesModules)) {
      for (const [method, options] of Object.entries(module)) {
        fastify.route({
          method: method.toUpperCase(),
          url: url.toLowerCase(),
          ...options,
        })
      }
    }
  },
  {
    fastify: '>=3.0.0',
    name: 'fastify-autoroutes',
  }
)

function loadModule(
  name: string,
  path: string
): (instance: FastifyInstance) => StrictResource {
  const module = require(path)

  if (typeof module === 'function') {
    return module as (instance: any) => StrictResource
  }

  if (
    typeof module === 'object' &&
    'default' in module &&
    typeof module.default === 'function'
  ) {
    return module.default as (instance: any) => StrictResource
  }

  throw new Error(
    `${ERROR_LABEL}: invalid route module definition (${name}) ${path}. Must export a function`
  )
}
