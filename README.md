# fastify-autoroutes

![CI workflow](https://github.com/GiovanniCardamone/fastify-autoroutes/workflows/CI%20workflow/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes/badge.svg)](https://snyk.io/test/github/GiovanniCardamone/fastify-autoroutes)

Map directory structure to routes

## Install

`npm install --save fastify-autoroutes`

## Usage

```js
const fastify = require('fastify')
const Boom = require('boom')

fastify.register(require('fastify-autoroutes'), { directory: './<where you want to put automatic routes>' })
```

## License

Licensed under [MIT](./LICENSE)
