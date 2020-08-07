/// <reference types="node" />
import { RouteOptions } from 'fastify';
export declare type ValidMethods = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS';
export declare type AnyRoute = Omit<RouteOptions, 'method' | 'url'>;
export declare type DeleteRoute = AnyRoute;
export declare type GetRoute = Omit<AnyRoute, 'body'>;
export declare type HeadRoute = AnyRoute;
export declare type PatchRoute = AnyRoute;
export declare type PostRoute = AnyRoute;
export declare type PutRoute = AnyRoute;
export declare type OptionsRoute = AnyRoute;
export interface Resource {
    delete?: DeleteRoute;
    get?: GetRoute;
    head?: HeadRoute;
    patch?: PatchRoute;
    post?: PostRoute;
    put?: PutRoute;
    options?: OptionsRoute;
}
interface FastifyAutoroutesOptions {
    dir: string;
}
declare const _default: import("fastify").FastifyPluginCallback<FastifyAutoroutesOptions, import("http").Server>;
export default _default;
