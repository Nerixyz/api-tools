import { Class, DependencyContainer, IllegalArgumentError } from './injection';
import { ApiRequest, ControllerOptions, RestrictFn } from './types';
import { MetadataKey } from './decorators';
import * as express from 'express';
import { Express, json, Request, Response, Router } from 'express';
import * as path from 'path';
import { RequestError } from './errors';
import * as url from 'url';
import debug from 'debug';
import 'reflect-metadata';
import { FullResponse } from './FullResponse';
import * as http from 'http';

export class ApiServer {
  private static apiDebug = debug('api');
  dependencies = new DependencyContainer();
  controllers: ControllerInfo[] = [];
  server: Express = express();
  rawServer?: http.Server;

  constructor(private configure: (express: Express) => Router = (express => {
    const router = Router();
    express.use('/', router);
    router.use(json({strict: true}))
    return router;
  }), private port = 3000) {
  }

  registerController(proto: Class): this {
    const meta = Reflect.getMetadata(MetadataKey.Controller, proto) as ControllerOptions;
    if (!meta) throw new IllegalArgumentError('Input is not a Controller');

    const instance = this.dependencies.inject(proto);

    this.controllers.push({
      path: meta.path,
      restriction: meta.restriction ?? (() => true),
      instance,
      routes: meta.routes?.map(route => ({
        path: route.path,
        method: route.method,
        restriction: route.restriction ?? (() => true),
        key: route.key ?? '',
      })) ?? [],
    });

    return this;
  }

  registerDependency(value: any, instanceOrProto?: any): this {
    this.dependencies.registerDependency(value, instanceOrProto);
    return this;
  }

  inject<T>(proto: Class<T>): T {
    return this.dependencies.inject(proto);
  }

  build(): this {
    const router = this.configure(this.server);

    for (const controller of this.controllers) {
      for (const route of controller.routes) {
        const finalPath = path.join(controller.path, route.path).replace(/\\/g, '/');
        ApiServer.apiDebug(`Registering ${finalPath}`);
        // @ts-ignore -- assume it works
        router[route.method.toLowerCase()](finalPath, makeHandler(controller, route));
      }
    }
    ApiServer.apiDebug(`Listening on ${this.port}`);
    this.rawServer = this.server.listen(this.port);
    return this;
  }
}

function makeHandler(controller: ControllerInfo, route: RouteInfo) {
  return async (request: Request, response: Response) => {
    try {
      const constructed = constructRequest(request);
      if (await controller.restriction(constructed) && await route.restriction(constructed)) {
        const ret = await controller.instance[route.key](constructed);
        if (ret instanceof FullResponse) {
          ret.writeToResponse(response);
        } else if (typeof ret === 'string') {
          response.status(200).send(ret);
        } else if (Buffer.isBuffer(ret)) {
          response.status(200).send(ret).contentType('application/octet-stream');
        } else {
          response.status(200).json(ret);
        }
      } else {
        // noinspection ExceptionCaughtLocallyJS
        throw new RequestError(401, 'Restricted. That\'s sad :/');
      }
    } catch (e) {
      if (e instanceof RequestError) {
        response.status(e.statusCode).json({
          status: 'error',
          message: e.errorMessage,
        });
      } else {
        response.status(500).json({
          status: 'error',
          message: 'Internal Error.',
        });
        // TODO: logging
      }
    }
  };
}

function constructRequest(request: Request): ApiRequest {
  return {
    body: request.body,
    headers: request.headers,
    method: request.method,
    query: request.query,
    url: url.parse(request.url),
    urlParams: request.params,
    raw: request,
  };
}

interface ControllerInfo {
  path: string;
  restriction: RestrictFn;
  routes: RouteInfo[];
  instance: any;
}

interface RouteInfo {
  path: string;
  method: string;
  restriction: RestrictFn;
  key: string;
}
