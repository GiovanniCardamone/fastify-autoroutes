import test from 'tap'

import Fastify from 'fastify'
import Plugin from '../'

test('check options', async (t) => {
  t.throws(fastify.register(Plugin, {}), Error)
})
