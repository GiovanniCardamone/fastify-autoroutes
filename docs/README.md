# [fastify-autoroutes](https://github.com/GiovanniCardamone/fastify-autoroutes)

fastify-autoroutes help to manage the routes in your project and map it automatically based on the file system hierarchy. So you don't have to search around where a function mapped to url is locate. Just follow the url path in your filesystem.

## Install

to install fastify-autoroutes you can just download it from npmjs respository with:

```sh
npm install --save fastify-autoroutes
```

## Initialize plugin

> :information_source: `dir` is relative to your current working directory.
>
> So if you are in `src` folder is `src/routes`.
> Otherwise if you are in `dist` folder it's `dist/routes`
>
> javascript
>
> ```javascript
> const fastify = require('fastify')
> const server = fastify()
>
> server.register(require('fastify-autoroutes'), {
>   dir: './routes',
> })
> ```

## Your first autoroute

suppose to have a project thats looks like this:

```text
/
├── index.js
├── package.json
└── routes
    └── index.js
```

and the plugin configured in this way:

```javascript
server.register(require('fastify-autoroutes'), {
  dir: './routes',
})
```

automatically on start the plugin will load the content of `routes` folder and map it at the start of your url.

> `http://your-host` is mapped to `your-project/routes/index.js`

and any of method in `your-project/routes/index.js` are exposed to that url.

## Nested autoroutes

let's suppose we have a more complex routes in our system like the following one:

```text
/
├── index.js
├── package.json
└── routes
    └── hello
        └── world.js
```

in this case, the plugin will recursivley scan any of routes subdirectory and map it urls

> example server
>
> ```javascript
> const fastify = require('fastify')
> const server = fastify()
>
> server.register(require('fastify-autoroutes'), {
>   dir: './routes',
> })
>
> server.ready(function () {
>   console.log(server.printRoutes())
> })
>
> server.listen(9999)
> ```
>
> output of `server.printRoutes()`
>
> ```text
> └── /
>     └── hello/world (GET|POST)
> ```

> :warning: those two directory structure are **NOT** equivalent:
> :information_source: you have to set `ignoreTrailingSlash: true` to make it the same.
>
> ```text
> /                                    | /
> ├── index.js                         | ├── index.js
> ├── package.json                     | ├── package.json
> └── routes                           | └── routes
>     └── hello                        |     └── hello
>         └── world.js                 |         └── world
>                                      |             └── index.js
>                                      |
> mapped to url:                       | mapped to url:
> http://your-host/hello/world         | http://your-host/hello/world/
> ```

## Url parameters in autoroutes

Is very useful to have parameters in urls, and we need some syntax to handle this "special" case. We use liquid variable format in file names to handle it.

> :information_source: you can also use syntax `:paramName` but is not windows an NTFS file name compatible, so be careful if you use it and than you want to move to Windows

example:

```text
.
├── index.js
├── package.json
└── routes
    └── users
        ├── {userId}
        │   └── posts.js
        └── {userId}.js
```

in this scenario we will have a routes like the following one:

```text
└── /
    └── users/
        └── :userId (GET)
            └── /posts (GET)
```

## Example of javascript module (es3)

here is the [List of supported routes options](https://www.fastify.io/docs/latest/Routes/#routes-option) provided by fastify, any of those you can use in your route method.

```javascript
module.exports = function (fastifyInstance) {
  return {
    get: {
      // options `method` and `url` are ignored, the other one is the same
      handler: function (request, reply) {
        reply.send('this is get method')
      },
    },
  }
}
```

## Example of javascript module (es6)

```javascript
export default () => ({
  get: {
    handler: async () => 'this is get method',
  },
})
```

## Typescript support for modules

is useful to have typescript for strict type check of the module we export and provide to fastify, here is an example of how to use is.

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Resource } from 'fastify-autoroutes'

export default (fastify: FastifyInstance) => {
  return <Resource> {
    post: {
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        return 'hello world'
      },
    },
  }
}
```

## Contribute

That's all, i hope you like my little module and contribution of any kind are welcome!

If you want to contribute remember to comment on an issue or pull request with:

`@all-contributors please add @jakebolam for infrastructure, tests and code`

here you can check the [emoji key](https://allcontributors.org/docs/en/emoji-key)

and i will pull the request as soon as possible.

Consider to leave a :star: if you like the project :blush:
