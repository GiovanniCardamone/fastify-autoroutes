# fastify-autoroutes

![CI workflow](https://github.com/GiovanniCardamone/fastify-autoroutes/workflows/CI%20workflow/badge.svg)

[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-gren.svg?style=flat)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Automatic add routes based on file system hierarchy

**[Full Documentation](https://giovannicardamone.github.io/fastify-autoroutes/)**

## :rocket: Install

```sh
npm install --save fastify-autoroutes
```

## :blue_book: Usage

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

## :arrow_forward: Accepted Methods

- delete
- get
- head
- patch
- post
- put
- options

## :arrow_forward: Url Parameters

to use url parameters in your route use `{parmName}` in your file or directory, it will be automatically changet to fastify parameter

## :arrow_forward: Skip files in autoroutes di

to skip file in routes directory, prepend the `.` or `_` charater to filename

examples:

- `.skipped_directory`
- `_also_skipped_directory`
- `.skipped_file.js`
- `.skipped_file.ts`
- `_also_skipped_file.js`
- `_also_skipped_file.ts`

## :arrows_clockwise: Changes

Check [CHANGELOG](./CHANGELOG.md)

## :page_facing_up: License

Licensed under [MIT](./LICENSE)

## :sparkles: Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

If you want to contribute remember to comment on an issue or pull request with:
@all-contributors please add @jakebolam for infrastructure, tests and code

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://giovannicardamone.github.io"><img src="https://avatars0.githubusercontent.com/u/5117748?v=4" width="100px;" alt=""/><br /><sub><b>Giovanni Cardamone</b></sub></a><br /><a href="https://github.com/GiovanniCardamone/fastify-autoroutes/commits?author=GiovanniCardamone" title="Code">💻</a> <a href="https://github.com/GiovanniCardamone/fastify-autoroutes/commits?author=GiovanniCardamone" title="Documentation">📖</a> <a href="#example-GiovanniCardamone" title="Examples">💡</a> <a href="#maintenance-GiovanniCardamone" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
