import { Url } from 'url';
import { IncomingMessage } from 'http';

export interface ControllerOptions {
  path: string;
  restriction: RestrictFn;
  routes: RouteOptions[];
}

export interface RouteOptions {
  method: string;
  path: string;
  key?: string;
  restriction?: RestrictFn;
}

export type Eventually<T> = T | Promise<T>;
export type RestrictFn = (request: ApiRequest) => Eventually<boolean>;

export interface ApiRequest<Search extends object = any, Body extends object = any, UrlParams extends object = any, Headers extends object = any> {
  url: Url;
  urlParams: UrlParams;
  query: Search;
  body: Body;
  method: string;
  headers: Headers;
  raw: IncomingMessage;
}
