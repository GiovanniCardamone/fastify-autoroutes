# fastify-autoroutes

![CI workflow](https://github.com/GiovanniCardamone/fastify-autoroutes/workflows/CI%20workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes)

Map directory structure to routes

**[Full Documentation](https://giovannicardamone.github.io/fastify-autoroutes/)**

## Install

`npm install --save fastify-autoroutes`

## How it works

Fastify-autoroutes will map the directory tree of filesystem to urls.

for example the file
`<autoroutes-directory>/user/:userid/index.js`
or `<autoroutes-directory>/user/:userid.js`

will handle the request to
`<your-host>/user/{user id}`.

---

you can use method `fastifyInstance.printRoutes()` to see all routes after fastify-autoroutes inject it.

## Usage

```js
const fastify = require('fastify')

fastify.register(require('fastify-autoroutes'), {
  directory: './<autoroutes-directory>',
})
```

```js
//file: `<autoroutes-directory>/index.js`
//mapped to: `<your host>`

export default (fastifyInstance) => {
  get: {
    // [optional] your resource on get
    handler: (request, reply) => {
      return 'hello index route'
    }
  },
  post: {
    // [optional] your resource on post
  },
  put: {
    // [optional] your resource on put
  },
  delete: {
    // [optional] your resource on delete
  },
  options: {
    // [optional] your resource on options
  },
  head: {
    // [optional] your resource on head
  }
}
```

## How to skip file using autoroutes

- add . to start of file (example: `.user.js` || `.user.ts`)
- or move file outside of `<autoroutes-directory>`

## License

Licensed under [MIT](./LICENSE)
