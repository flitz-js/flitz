// Copyright 2020-present Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { createServer as createHttpServer, IncomingMessage, ServerResponse, Server } from 'http';
import { addStatic } from './_static';
import { CanBeNil, IsOptional } from '..';
import { asAsync } from '../_helpers';
import { defaultErrorHandler, defaultNotFoundHandler } from '../handlers';
import { compileAllWithMiddlewares, RequestHandlersGrouped, withMethod, WithMethodOptions } from '../handlers/_helpers';

/**
 * A Flitz instance.
 */
export interface Flitz {
  /**
   * A flitz server itself is a HTTP request listener,
   * which can be used in any compatible server instance, like
   * Node HTTP, e.g.
   */
  (request: IncomingMessage, response: ServerResponse): void;

  /**
   * Closes / stops the server.
   */
  close(): Promise<void>;

  /**
   * Registers a route for a CONNECT request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  connect(path: RequestPath, handler: RequestHandler): this;
  connect(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a DELETE request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  delete(path: RequestPath, handler: RequestHandler): this;
  delete(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a GET request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  get(path: RequestPath, handler: RequestHandler): this;
  get(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a HEAD request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  head(path: RequestPath, handler: RequestHandler): this;
  head(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * The underlying HTTP server instance.
   */
  readonly instance?: IsOptional<Server>;

  /**
   * Starts listening.
   *
   * @param {number} port The TCP port.
   */
  listen(port: number): Promise<void>;

  /**
   * Registers a route for a OPTIONS request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  options(path: RequestPath, handler: RequestHandler): this;
  options(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a PATCH request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  patch(path: RequestPath, handler: RequestHandler): this;
  patch(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a POST request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  post(path: RequestPath, handler: RequestHandler): this;
  post(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Registers a route for a PUT request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  put(path: RequestPath, handler: RequestHandler): this;
  put(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Sets a new error handler.
   * 
   * @param {RequestErrorHandler} handler The new handler.
   * 
   * @returns {this}
   */
  setErrorHandler(handler: RequestErrorHandler): this;

  /**
   * Sets a new 'not found' handler.
   * 
   * @param {NotFoundHandler} handler The new handler.
   * 
   * @returns {this}
   */
  setNotFoundHandler(handler: NotFoundHandler): this;

  /**
   * Adds a GET handler, for using a local directory as static files.
   *
   * @param {string} basePath The base path of the request url.
   * @param {string} rootDir The local root directory.
   * @param {boolean} [cache] Load all files and cache them into memory. Default: (true) 
   * 
   * @returns {this}
   */
  static(basePath: string, rootDir: string, cache?: boolean): this;

  /**
   * Registers a route for a TRACE request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  trace(path: RequestPath, handler: RequestHandler): this;
  trace(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;

  /**
   * Adds one or more global middlewares.
   *
   * @param {Middleware[]} [middlewares] The middlewares to add.
   * 
   * @returns {this}
   */
  use(...middlewares: Middleware[]): this;
}

/**
 * A middleware.
 * 
 * @param {IncomingMessage} request The request context.
 * @param {ServerResponse} response The response context.
 * @param {NextFunction} next The next function.
 */
export type Middleware = (request: Request, response: Response, next: NextFunction) => Promise<any>;

/**
 * A next function.
 */
export type NextFunction = () => void;

/**
 * A 'not found' handler.
 * 
 * @param {IncomingMessage} request The request context.
 * @param {ServerResponse} response The response context.
 */
export type NotFoundHandler = (request: IncomingMessage, response: ServerResponse) => Promise<any>;

/**
 * Request handler options or one or more middleware(s).
 */
export type OptionsOrMiddlewares = RequestHandlerOptions | Middleware | Middleware[];

/**
 * A request context.
 */
export interface Request extends IncomingMessage {
}

/**
 * A request error handler.
 * 
 * @param {any} error The error.
 * @param {IncomingMessage} request The request context.
 * @param {ServerResponse} response The response context.
 */
export type RequestErrorHandler = (error: any, request: IncomingMessage, response: ServerResponse) => Promise<any>;

/**
 * A request handler.
 * 
 * @param {Request} request The request context.
 * @param {Response} response The response context.
 */
export type RequestHandler = (request: Request, response: Response) => Promise<any>;

/**
 * Options for a request handler.
 */
export interface RequestHandlerOptions {
  /**
   * A list of one or more middlewares.
   */
  use?: CanBeNil<Middleware[]>;
}

/**
 * A possible value for a request path.
 */
export type RequestPath = string | RegExp | RequestPathValidator;

/**
 * Validates a request path.
 * 
 * @param {IncomingMessage} request The request context.
 * 
 * @returns {boolean} Path does match or not.
 */
export type RequestPathValidator = (request: IncomingMessage) => boolean;

/**
 * A response context.
 */
export interface Response extends ServerResponse {
}

const HTTP_METHODS = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

/**
 * Creates a new server instance.
 * 
 * @returns {Flitz} The new instance.
 */
export function createServer(): Flitz {
  let errorHandler: RequestErrorHandler = defaultErrorHandler;
  const getErrorHandler = () => errorHandler;
  const globalMiddleWares: Middleware[] = [];
  let instance: IsOptional<Server>;
  let notFoundHandler: NotFoundHandler = defaultNotFoundHandler;

  const groupedHandlers: RequestHandlersGrouped = {};
  let compiledHandlers: RequestHandlersGrouped = groupedHandlers;
  const recompileHandlers = () => {
    compiledHandlers = compileAllWithMiddlewares(
      groupedHandlers,
      globalMiddleWares,
      getErrorHandler
    );
  };

  const flitz: any = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const handler = compiledHandlers[req.method!]?.find(ctx => ctx.isPathValid(req))?.handler;

      if (handler) {
        await handler(req, res);
      } else {
        await notFoundHandler(req, res);
      }
    } catch (e) {
      await errorHandler(e, req, res);
    }
  };

  // flitz.instance
  Object.defineProperty(flitz, 'instance', {
    enumerable: true,
    get: () => instance
  });

  // request handler methods
  // .connect(), .get(), .post(), etc.
  for (const method of HTTP_METHODS) {
    flitz[method.toLowerCase()] = createHandlerMethod(
      { method, flitz, getErrorHandler, groupedHandlers, recompileHandlers }
    );
  }

  flitz.setErrorHandler = function (handler: RequestErrorHandler) {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    errorHandler = asAsync<RequestErrorHandler>(handler);
    return this;
  };

  flitz.setNotFoundHandler = function (handler: NotFoundHandler) {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    notFoundHandler = asAsync<NotFoundHandler>(handler);
    return this;
  };

  flitz.static = function (basePath: string, rootDir: string, cache = true) {
    return addStatic({ basePath, cache, flitz, rootDir });
  };

  flitz.use = function (...middlewares: Middleware[]) {
    const moreMiddlewares = middlewares.filter(mw => !!mw);
    if (!moreMiddlewares.every(mw => typeof mw === 'function')) {
      throw new TypeError('middlewares must be a list of functions');
    }

    globalMiddleWares.push(...moreMiddlewares.map(mw => asAsync<Middleware>(mw)));
    recompileHandlers();

    return this;
  };

  flitz.listen = function (port: number) {
    if (typeof port !== 'number') {
      throw new TypeError('port must be a number');
    }

    if (!(port >= 0 && port <= 65535)) {
      throw new TypeError('port must be a valid number between 0 and 65535');
    }

    return new Promise((resolve, reject) => {
      instance = createHttpServer(flitz);

      instance.once('error', err => {
        reject(err);
      });

      instance.listen(port, () => {
        resolve();
      });
    });
  };

  flitz.close = function () {
    return new Promise((resolve, reject) => {
      instance!.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  return flitz;
}

function createHandlerMethod(opts: WithMethodOptions): Function {
  return function () {
    return withMethod({
      ...opts,
      arguments
    });
  };
}
