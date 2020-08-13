# fastify-autoroutes

<div align="center">

![Logo](./logo.png)

![JavaScript](https://img.shields.io/badge/ES6-Supported-yellow.svg?style=for-the-badge&logo=JavaScript) &nbsp; ![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue.svg?style=for-the-badge)

[![NPM version](https://img.shields.io/npm/v/fastify-autoroutes.svg?style=flat)](https://www.npmjs.com/package/fastify-autoroutes)
[![NPM downloads](https://img.shields.io/npm/dm/fastify-autoroutes.svg?style=flat)](https://www.npmjs.com/package/fastify-autoroutes)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes)
[![GitHub license](https://img.shields.io/github/license/GiovanniCardamone/fastify-autoroutes.svg)](https://github.com/GiovanniCardamone/fastify-autoroutes/blob/master/LICENSE)

![CI](https://github.com/GiovanniCardamone/fastify-autoroutes/workflows/CI/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/GiovanniCardamone/fastify-autoroutes/badge.svg?branch=dev)](https://coveralls.io/github/GiovanniCardamone/fastify-autoroutes?branch=master)

</div>

> :star: Thanks to everyone who has starred the project, it means a lot!

Automatic add routes based on file system hierarchy.

**[Full Documentation](https://giovannicardamone.github.io/fastify-autoroutes/)**

## :rocket: Install

```sh
npm install --save fastify-autoroutes
```

## :blue_book: Usage

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

export default (fastifyInstance) => ({
  get: {
    // any of routes option allowed by fastify: https://www.fastify.io/docs/latest/Routes/#routes-option
    // except for `url` and `method`

    handler: (request, reply) => {
      reply.send('hello index route')
    }
  },
  // other available methods are following: ['delete', 'get', 'head', 'patch', 'post', 'put', 'options']
})
```

> :information_source: use syntax `:paramName` or `{paramName}` in file name to specify url parameters

```js
//file: `<autoroutes-directory>/users/{userId}/photos.js`
//mapped to: `<your host>/users/:userId/photos`

export default (fastifyInstance) => ({
  get: {
    handler: (request, reply) => {
      reply.send(`photos of user ${request.params.userId}`)
    }
  },
})
```

## :arrow_forward: Accepted methods in module

- delete
- get
- head
- patch
- post
- put
- options

## :arrow_forward: Url parameters using path name

to use url parameters in your route use `{parmName}` in your file or directory, it will be automatically changed to fastify parameter

## :arrow_forward: Skip files in autoroutes directory

to skip file in routes directory, prepend the `.` or `_` charater to filename

examples:

- `.skipped_directory`
- `_also_skipped_directory`
- `.skipped_file.js`
- `.skipped_file.ts`
- `_also_skipped_file.js`
- `_also_skipped_file.ts`

> :warning: also any `*.test.js` and `*.test.ts` are skipped!

this is useful if you want to have a lib file containts functions that don't have to be a route, so just create the file with `_` prepending character

## :page_facing_up: License

Licensed under [MIT](./LICENSE)

## :sparkles: Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://giovannicardamone.github.io"><img src="https://avatars0.githubusercontent.com/u/5117748?v=4" width="100px;" alt=""/><br /><sub><b>Giovanni Cardamone</b></sub></a><br /><a href="https://github.com/GiovanniCardamone/fastify-autoroutes/commits?author=GiovanniCardamone" title="Code">💻</a> <a href="https://github.com/GiovanniCardamone/fastify-autoroutes/commits?author=GiovanniCardamone" title="Documentation">📖</a> <a href="#example-GiovanniCardamone" title="Examples">💡</a> <a href="#maintenance-GiovanniCardamone" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/genbs"><img src="https://avatars0.githubusercontent.com/u/6159598?v=4" width="100px;" alt=""/><br /><sub><b>Gennaro</b></sub></a><br /><a href="#design-genbs" title="Design">🎨</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
