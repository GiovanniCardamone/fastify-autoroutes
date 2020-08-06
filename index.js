'use strict'

const fp = require('fastify-plugin')
const fs = require('fs')
const path = require('path')

function fastifyAutoroutes(fastify, options, next) {
  console.log('wtf')
  if (!options.directory) {
    return next(new Error('missing autoroutes directory'))
  }

  if (typeof options.directory !== 'string') {
    return next(new Error('autoroutes directory options must be a string'))
  }

  if (!fs.existsSync(options.directory) || !fs.statSync(options.directory).isDirectory) {
    return next(new Error(`directory ${options.directory} must exists and must be a directory`))
  }
}

module.exports = fp(fastifyAutoroutes, {
  fastify: '>=3.0.0-alpha.1',
  name: 'fastify-autoroutes',
})
