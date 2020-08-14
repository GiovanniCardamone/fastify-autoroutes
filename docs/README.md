# fastify-autoroutes

fastify-autoroutes is an innovative way to declare routes in your fastify app.

Just specify a directory for routes and fastify-autoroutes will care of import any routes in a same way is defined in your filesystem structures.

## Getting started

### Install

Install with npm:

```sh
npm i fastify-autoroutes --save
```

Install with yarn:

```sh
yarn add fastify-autoroutes
```

### Initialize plugin

create a root directory for your autoroutes and pass it to plugin

```javascript
const fastify = require('fastify')
const server = fastify()
server.register(require('fastify-autoroutes'), {
  dir: './routes', // routes is my directory in this example
})
```

### Write your first route

Javascript:

```javascript
//file: ./routes/index.js
//url: http://your-host

export default (fastifyInstance) => ({
  get: {
    handler: async () => 'Hello, Index!'
  }
})

```

Typescript:

```typescript
//file: ./routes/index.js
//url: http://your-host
import { FastifyInstance } from 'fastify'
import { Resource } from 'fastify-autoroutes'

export default (fastifyInstance: FastifyInstance) => <Resource> {
  get: {
    handler: async () => 'Hello, Index!'
  }
}
```

Directory tree of your file system will look like this:

```text
/
├── index.js
├── package.json
└── routes
    └── index.js
```

## Nested autoroutes

Autoroutes directory scenario:

```text
/
├── index.js
├── package.json
└── routes
    └── hello         => http://your-host/hello
        └── world.js  => http://your-host/hello/world
```

in this case, the plugin will recursivley scan any routes in directory and map it urls

> :warning: those two directory structure are **NOT** equivalent:
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

> :information_source: you have to set `ignoreTrailingSlash: true` to make it the same.

## Ignore routes

to ignore routes there are few way:

- prepend '.' character to your file/directory name
- prepend '_' characher to your file/directory name

> :information_source: files `*.test.js` and `*.test.ts` are automatically ignored

examples:

```text
routes
├── .ignored-directory
├── _ignored-directory
├── .ignored-js-file.js
├── _ignored-js-file.js
├── .ignored-ts-file.ts
├── _ignored-ts-file.ts
├── ignored-js-test.test.js
└── ignored-ts-test.test.ts
```

## Url parameters in autoroutes

parameters in URL can be specified using `liquid-variable-syntax` or (Not on windows) prepending `:` to the name of file or directory

examples:

using liquid variable syntax

```text
.
├── index.js
├── package.json
└── routes
    └── users
        ├── {userId}
        │   └── posts.js  => http://your-host/users/<user-id>/posts
        └── {userId}.js   => http://your-host/users/<user-id>
```

using `:` syntax (Not on windows)

```text
.
├── index.js
├── package.json
└── routes
    └── users
        ├── :userId
        │   └── posts.js  => http://your-host/users/<user-id>/posts
        └── :userId.js   => http://your-host/users/<user-id>
```

### Retrieve parameters

Parameters will be injected in route just like normal url matching syntax:

```javascript
//file: ./routes/{userId}/posts.js

export default (fastifyInstance) => ({
  get: {
    handler: async (request) => `returning posts of user: ${request.params.userId}`
  }
})
```

## Accepted methods in module

each file must export a function that accept fastify as parameter, and return an object with the following properties:

```javascript
export default (fastifyInstance) => ({
  delete: {
    // your handler logic
  },
  get: {
    // your handler logic
  },
  head: {
    // your handler logic
  },
  patch: {
    // your handler logic
  },
  post: {
    // your handler logic
  },
  put: {
    // your handler logic
  },
  options: {
    // your handler logic
  },
})

```

### Route definition

Each route should be complaint to fastify route: [Method Specification](https://www.fastify.io/docs/latest/Routes/#full-declaration)

the only exceptions is for `url` and `method` which are automatically mapped by project structure.

## Example using Javascript version es3

```javascript
module.exports = function (fastifyInstance) {
  return {
    get: {
      handler: function (request, reply) {
        reply.send('this is get method')
      },
    },
  }
}
```

## Typescript support for modules

is useful to have typescript for strict type check of the module.
use definition `Resource` for type check your route

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Resource } from 'fastify-autoroutes'

export default (fastify: FastifyInstance) => {
  return <Resource> {
    post: {
      handler: async (request: FastifyRequest, reply: FastifyReply) => {
        return 'Hello, World!'
      },
    },
  }
}
```

## Contribute

That's all, i hope you like my little module and contribution of any kind are welcome!

I will mention you in my README for any of yours contribution

Consider to leave a :star: if you like the project :blush:
