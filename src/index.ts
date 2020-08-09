import fastifyPlugin from 'fastify-plugin'
import { FastifyInstance, RouteOptions } from 'fastify'

import process from 'process'
import path from 'path'
import fs from 'fs'
import { Interface } from 'readline'
import { runInContext } from 'vm'

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
    !file.startsWith('.') &&
    !file.startsWith('_') &&
    !file.endsWith('.test.js') &&
    !file.endsWith('.test.ts') &&
    (stat.isFile() || stat.isSymbolicLink())
  )
}

function pathToUrl(path: string) {
  let url =
    '/' + path.replace('.ts', '').replace('.js', '').replace('index', '')

  if (url.length === 1) return url

  return url
    .split('/')
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
  const module = loadModule(fullPath)

  if (typeof module !== 'function') {
    throw new Error(`module ${fullPath} must export default function`)
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
      const message = 'dir must be specified'
      console.error(`[ERROR] fastify-autoload: ${message}`)
      return next(new Error(message))
    }

    if (typeof options.dir !== 'string') {
      const message = 'dir must be string'
      console.error(`[ERROR] fastify-autoload: ${message}`)
      return next(new Error(message))
    }

    const dirPath = path.join(process.cwd(), process.argv[1], '..', options.dir)

    if (!fs.existsSync(dirPath)) {
      const message = `dir ${dirPath} does not exists`
      console.error(`[ERROR] fastify-autoload: ${message}`)
      return next(new Error(message))
    }

    if (!fs.statSync(dirPath).isDirectory()) {
      const message = `dir ${dirPath} must be a directory`
      console.error(`[ERROR] fastify-autoload: ${message}`)
      return next(new Error(message))
    }

    try {
      scan(fastify, dirPath, '', options.log)
    } catch (error) {
      const message = error.message
      console.error(`[ERROR] fastify-autoload: ${message}`)
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
