import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, RouteOptions } from 'fastify'

import { JsonSchema } from 'type-jsonschema'

import process from 'process'
import path from 'path'
import fs from 'fs'

export const errorLabel = '[ERROR] fastify-autoload:'

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

interface Response<> {
  description: string
  content: {
    'application/json': {
      schema: JsonSchema
    }
  }
}

interface StrictAnyRoute extends AnyRoute {
  schema: {
    body?: JsonSchema
    querystring?: JsonSchema
    params?: JsonSchema
    headers?: JsonSchema
    response?: { [key: number]: Response }
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
  dir: string
  log?: boolean
}

function scan(
  fastify: FastifyInstance,
  baseDir: string,
  current: string,
  log: boolean = false
) {
  const combined = path.join(baseDir, current)
  const combinedStat = fs.statSync(combined)

  if (combinedStat.isDirectory()) {
    for (const entry of fs.readdirSync(combined)) {
      scan(fastify, baseDir, path.join(current, entry), log)
    }
  } else if (isAcceptableFile(combined, combinedStat)) {
    autoload(fastify, combined, pathToUrl(current), log)
  }
}

function isAcceptableFile(file: string, stat: fs.Stats): boolean {
  return (
    !path.basename(file).startsWith('.') &&
    !path.basename(file).startsWith('_') &&
    !file.endsWith('.map') &&
    !file.endsWith('.test.js') &&
    !file.endsWith('.test.ts') &&
    stat.isFile()
  )
}

function pathToUrl(filePath: string) {
  let url =
    '/' + filePath.replace('.ts', '').replace('.js', '').replace('index', '')

  if (url.length === 1) return url

  return url
    .split(path.sep)
    .map((part) => replaceParamsToken(part))
    .join('/')
}

function replaceParamsToken(token: string) {
  const regex = /{.+}/g

  let result
  while ((result = regex.exec(token)) !== null) {
    token =
      token.substring(0, result.index) +
      result[0].replace('{', ':').replace('}', '') +
      token.substr(result.index + result[0].length)
  }

  return token
}

function autoload(
  fastify: FastifyInstance,
  fullPath: string,
  url: string,
  log: boolean
) {
  const module = loadModule(fullPath, log)

  if (typeof module !== 'function') {
    throw new Error(
      `${errorLabel} module ${fullPath} must be valid js/ts module and should export route methods definitions`
    )
  }

  const routes = module(fastify)

  for (const [method, route] of Object.entries<RouteOptions>(routes)) {
    if (validMethods.includes(method)) {
      route.url = url
      route.method = method.toUpperCase() as ValidMethods

      fastify.route(route)

      if (log) {
        console.info(`${method.toUpperCase()} ${url} => ${fullPath}`)
      }
    }
  }
}

function loadModule(path: string, log: boolean) {
  const module = require(path)

  if (typeof module === 'function') {
    return module
  }

  if (typeof module === 'object' && 'default' in module) {
    return module.default
  }

  return
}

export default fastifyPlugin<FastifyAutoroutesOptions>(
  (fastify: any, options: any, next: any) => {
    const log = options.log ?? true

    if (!options.dir) {
      const message = `${errorLabel} dir must be specified`
      log && console.error(message)

      return next(new Error(message))
    }

    if (typeof options.dir !== 'string') {
      const message = `${errorLabel} dir must be the path of autoroutes-directory`
      log && console.error(message)

      return next(new Error(message))
    }

    let dirPath: string

    if (path.isAbsolute(options.dir)) {
      dirPath = options.dir
    } else if (path.isAbsolute(process.argv[1])) {
      dirPath = path.join(process.argv[1], '..', options.dir)
    } else {
      dirPath = path.join(process.cwd(), process.argv[1], '..', options.dir)
    }

    if (!fs.existsSync(dirPath)) {
      const message = `${errorLabel} dir ${dirPath} does not exists`
      log && console.error(message)

      return next(new Error(message))
    }

    if (!fs.statSync(dirPath).isDirectory()) {
      const message = `${errorLabel} dir ${dirPath} must be a directory`
      log && console.error(message)

      return next(new Error(message))
    }

    try {
      scan(fastify, dirPath, '', options.log)
    } catch (error) {
      log && console.error(error.message)

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
