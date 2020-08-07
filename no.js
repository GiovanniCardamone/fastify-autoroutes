'use strict'

const fastifyPlugin = require('fastify-plugin')
const fs = require('fs')
const path = require('path')
const process = require('process')

const existsSync = fs.existsSync
const statSync = fs.statSync
const readdirSync = fs.readdirSync
const basename = path.basename
const join = path.join
const cwd = process.cwd

function fastifyAutoroutes(fastify, options, next) {
  if (!options.directory) {
    return next(new Error('missing autoroutes directory'))
  }

  if (typeof options.directory !== 'string') {
    return next(new Error('autoroutes directory options must be a string'))
  }

  if (
    !existsSync(options.directory) ||
    !statSync(options.directory).isDirectory()
  ) {
    return next(
      new Error(
        `directory ${options.directory} must exists and must be a directory`
      )
    )
  }

  try {
    scanPath(fastify, join(process.cwd(), options.directory), '')
  } catch (error) {
    console.error(error)
    return next(error)
  }
}

function scanPath(fastify, basePath, currentPath) {
  console.log('scanning', basePath, currentPath)
  const target = join(basePath, currentPath)
  const current = statSync(target)

  if (current.isDirectory()) {
    for (const file of readdirSync(target)) {
      scanPath(fastify, basePath, join(currentPath, file))
    }
  } else if (isValidFileModule(current, basename(target))) {
    addRouteModule(fastify, target)
  }
}

function isValidFileModule(file, fileName) {
  return (
    (file.isFile() || file.isSymbolicLink()) &&
    (!fileName.startsWith('.') || !fileName.startsWith('_')) &&
    (!fileName.endsWith('.test.js') || !file.endsWith('.test.ts'))
  )
}

function addRouteModule(fastify, path) {
  console.log('addRouteModule', path)
  const module = loadModule(path)

  if (typeof module.default !== 'function') {
    throw new Error(
      `module ${path} must export default function to accept Fastify`
    )
  }

  const resource = module.default(fastify)

  // if (typeof resource)
}

function loadModule(path) {
  try {
    return require(path)
  } catch (error) {
    throw new Error(`unable to load ${path}: ${error.message}`)
  }
}

module.exports = fastifyPlugin(fastifyAutoroutes, {
  fastify: '>=3.0.0',
  name: 'fastify-autoroutes',
})
