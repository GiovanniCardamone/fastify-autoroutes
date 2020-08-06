import { RouteOptions } from 'fastify'

declare module 'fastify-autoroutes' {
  type AnyRoute = Omit<RouteOptions, 'url' | 'method'>
  type GetRoute = Omit<AnyRoute, 'body'>
  type PutRoute = AnyRoute
  type PostRoute = AnyRoute
  type DeleteRoute = AnyRoute
  type HeadRoute = AnyRoute
  type OptionsRoute = AnyRoute

  export interface Rest {
    get?: GetRoute
    put?: PutRoute
    post?: PostRoute
    delete?: DeleteRoute
    head?: HeadRoute
    options?: OptionsRoute
  }
}
