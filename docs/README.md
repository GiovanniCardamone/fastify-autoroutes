# fastify-autoroutes

Automatic add routes based on file system hierarchy

## Install

```sh
npm install --save fastify-autoroutes
```

## Usage

```js
const fastify = require('fastify')
const server = fastify()

server.register(require('fastify-autoroutes'), {
  dir: './<autoroutes-directory>', // relative to your cwd
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
  // you can also use: ['delete', 'get', 'head', 'patch', 'post', 'put', 'options']
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

## Accepted Methods in Module

- delete
- get
- head
- patch
- post
- put
- options

## Url Parameters using path name

to use url parameters in your route use `{parmName}` in your file or directory, it will be automatically changet to fastify parameter

## Skip files in autoroutes directory

to skip file in routes directory, prepend the `.` or `_` charater to filename

examples:

- `.skipped_directory`
- `_also_skipped_directory`
- `.skipped_file.js`
- `.skipped_file.ts`
- `_also_skipped_file.js`
- `_also_skipped_file.ts`

this is useful if you want to have a lib file containts functions that don't have to be a route, so just create the file with `_` prepending character

## Examples

- [Example javascript App](https://github.com/GiovanniCardamone/fastify-autoroutes/tree/master/examples/simple-js-app)
- [Example typescript App](https://github.com/GiovanniCardamone/fastify-autoroutes/tree/master/examples/simple-ts-app)

## Contribute

To contribute to [fastify-autoroutes](https://github.com/GiovanniCardamone/fastify-autoroutes) please check the [CONTRIBUTING](https://github.com/GiovanniCardamone/fastify-autoroutes/master/CONTRIBUTING.md) file.

All contributions are apprecciated :smiley:

