import test from 'tap'

import Fastify from 'fastify'
import Plugin from '../'

test('test injected routes', async (t) => {
  const fastify = Fastify()

  t.throws(fastify.register(Plugin, {}), Error)
})
