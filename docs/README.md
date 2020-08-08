# fastify-autoroutes

![CI workflow](https://github.com/GiovanniCardamone/fastify-autoroutes/workflows/CI%20workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes)

Automatic add routes based on file system hierarchy

## Install

```sh
npm install --save fastify-autoroutes
```

## Usage

```js
const fastify = require('fastify')

fastify.register(require('fastify-autoroutes'), {
  dir: './<autoroutes-directory>',
})
```

```js
//file: `<autoroutes-directory>/some/route/index.js`
//mapped to: `<your host>/some/route`

export default (fastifyInstance) => {
  get: {
    // [optional] your resource on get
    handler: (request, reply) => {
      reply.send('hello index route')
    }
  },
}
```

> :information_source: use syntax `:paramName` or `{paramName}` in file name to specify url parameters

```js
//file: `<autoroutes-directory>/users/{userId}/photos.js`
//mapped to: `<your host>/users/:userId/photos`

export default (fastifyInstance) => {
  get: {
    // [optional] your resource on get
    handler: (request, reply) => {
      reply.send(`photos of user ${request.params.userId}`)
    }
  },
}
```

## Accepted methods

- delete
- get
- head
- patch
- post
- put
- options

## url parameters

to use url parameters in your route use `{parmName}` in your file or directory, it will be automatically changet to fastify parameter

## Skip files in autoroutes di

to skip file in routes directory, prepend the `.` or `_` charater to filename

examples:

- `.skipped`
- `_also_skipped`

## License

Licensed under [MIT](./LICENSE)
