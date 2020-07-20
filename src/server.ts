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
import { CanBeNil, IsOptional } from '.';
import { defaultErrorHandler, defaultNotFoundHandler } from './handlers';

/**
 * A Flitz instance.
 */
export interface Flitz {
  /**
   * A Flitz server itself itself is a HTTÜ request listener,
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
   * Registers a route for a TRACE request.
   * 
   * @param {RequestPath} path The path.
   * @param {OptionsOrMiddlewares} optionsOrMiddlewares The options or middlewares for the handler.
   * @param {RequestHandler} handler The handler.
   */
  trace(path: RequestPath, handler: RequestHandler): this;
  trace(path: RequestPath, optionsOrMiddlewares: OptionsOrMiddlewares, handler: RequestHandler): this;
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
 * Request handler options or list of middlewares.
 */
export type OptionsOrMiddlewares = RequestHandlerOptions | Middleware[];

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

interface RequestHandlerContext {
  handler: RequestHandler;
  isPathValid: RequestPathValidator;
}

type RequestHandlerGroup = { [method: string]: RequestHandlerContext[] };

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

interface WithMethodOptions {
  args: IArguments;
  groupedHandlers: RequestHandlerGroup;
  getErrorHandler: () => RequestErrorHandler;
  server: Flitz;
  method: string;
}

function isPathValidByRegex(path: RegExp) {
  return (req: IncomingMessage) => path.test(req.url!);
}

function isPathValidByString(path: string) {
  return (req: IncomingMessage) => req.url === path;
}

/**
 * Creates a new server instance.
 * 
 * @returns {Flitz} The new instance.
 */
export function createServer(): Flitz {
  let errorHandler: RequestErrorHandler = defaultErrorHandler;
  const getErrorHandler = () => errorHandler;
  const groupedHandlers: RequestHandlerGroup = {};
  let notFoundHandler: NotFoundHandler = defaultNotFoundHandler;
  let instance: IsOptional<Server>;

  const flitz: any = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const handler = groupedHandlers[req.method!]?.find(ctx => ctx.isPathValid(req))?.handler;

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
    enumerable: false,
    get: () => instance
  });

  flitz.connect = function () {
    return withMethod({ method: 'CONNECT', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.delete = function () {
    return withMethod({ method: 'DELETE', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.get = function () {
    return withMethod({ method: 'GET', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.head = function () {
    return withMethod({ method: 'HEAD', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.options = function () {
    return withMethod({ method: 'OPTIONS', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.patch = function () {
    return withMethod({ method: 'PATCH', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.post = function () {
    return withMethod({ method: 'POST', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.put = function () {
    return withMethod({ method: 'PUT', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };
  flitz.trace = function () {
    return withMethod({ method: 'TRACE', args: arguments, getErrorHandler, groupedHandlers, server: flitz });
  };

  flitz.setErrorHandler = function (handler: RequestErrorHandler) {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    errorHandler = handler;
    return this;
  };

  flitz.setNotFoundHandler = function (handler: NotFoundHandler) {
    if (typeof handler !== 'function') {
      throw new TypeError('handler must be a function');
    }

    notFoundHandler = handler;
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
      instance?.close(err => {
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

function mergeHandler(
  handler: RequestHandler,
  middlewares: Middleware[],
  getErrorHandler: () => RequestErrorHandler
): RequestHandler {
  return async function (req, res) {
    let i = -1;

    const handleError = (err: any) => {
      return getErrorHandler()(err, req, res);
    };

    const next = () => {
      const mw = middlewares[++i];

      if (mw) {
        mw(req, res, next).catch(handleError);
      } else {
        handler(req, res).catch(handleError);
      }
    };

    next();
  };
}

function withMethod(opts: WithMethodOptions): Flitz {
  const path: RequestPath = opts.args[0];
  if (
    !(
      typeof path === 'string' ||
      path instanceof RegExp ||
      typeof path === 'function'
    )
  ) {
    throw new TypeError('path must be of type string, function or RegEx');
  }

  let optionsOrMiddlewares: CanBeNil<OptionsOrMiddlewares>;
  let handler: RequestHandler;
  if (opts.args.length < 3) {
    // args[1]: RequestHandler
    handler = opts.args[1];
  } else {
    // args[1]: OptionsOrMiddlewares
    // args[2]: RequestHandler
    optionsOrMiddlewares = opts.args[1];
    handler = opts.args[2];
  }

  if (typeof handler !== 'function') {
    throw new TypeError('Error must be a function');
  }

  let options: RequestHandlerOptions;
  if (optionsOrMiddlewares) {
    if (Array.isArray(optionsOrMiddlewares)) {
      options = {
        use: optionsOrMiddlewares
      };
    } else {
      options = optionsOrMiddlewares;
    }
  } else {
    options = {};
  }

  if (typeof options !== 'object') {
    throw new TypeError('optionsOrMiddlewares must be an object or array');
  }
  if (options.use?.length) {
    if (!options.use.every(mw => typeof mw === 'function')) {
      throw new TypeError('optionsOrMiddlewares must be an array of functions');
    }
  }

  if (!opts.groupedHandlers[opts.method]) {
    // group is not initialized yet
    opts.groupedHandlers[opts.method] = [];
  }

  // setup request handler
  if (options.use?.length) {
    handler = mergeHandler(
      handler,
      options.use.map(mw => mw),
      opts.getErrorHandler
    );
  }

  // path validator
  let isPathValid: RequestPathValidator;
  if (typeof path === 'function') {
    isPathValid = path;
  } else if (path instanceof RegExp) {
    isPathValid = isPathValidByRegex(path);
  } else {
    isPathValid = isPathValidByString(path);
  }

  opts.groupedHandlers[opts.method].push({
    handler,
    isPathValid
  });

  return opts.server;
};
