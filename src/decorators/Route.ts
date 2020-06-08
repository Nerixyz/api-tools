import { ApiRequest, Eventually, RouteOptions } from '../types';
import { MetadataKey } from './metadata';

export function Route(options: Partial<RouteOptions>): RouteDecorator;
export function Route(method: string, path: string): RouteDecorator;
export function Route(optionsOrMethod: string | Partial<RouteOptions>, path?: string): RouteDecorator {
  return function (
    target: object,
    key: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: TypedPropertyDescriptor<(request: ApiRequest) => Eventually<any>>,
  ) {
    const meta = Reflect.getMetadata(MetadataKey.Controller, target.constructor) ?? { routes: [] };
    meta.routes.push({
      ...(typeof optionsOrMethod === 'string'
        ? {
            method: optionsOrMethod,
            path,
          }
        : optionsOrMethod),
      key,
    });
    Reflect.defineMetadata(MetadataKey.Controller, meta, target.constructor);
  };
}
type RouteDecorator = (target: any, key: symbol | string, descriptor: TypedPropertyDescriptor<(request: ApiRequest) => Eventually<any>>) => void;


export function Get(pathOrOptions: string | Partial<RouteOptions>) {
  return Route({
    ...(typeof pathOrOptions === 'string' ? {path: pathOrOptions} : pathOrOptions),
    method: 'GET',
  });
}
export function Post(pathOrOptions: string | Partial<RouteOptions>) {
  return Route({
    ...(typeof pathOrOptions === 'string' ? {path: pathOrOptions} : pathOrOptions),
    method: 'POST',
  });
}
