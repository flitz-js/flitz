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

import { IncomingMessage } from 'http';
import { CanBeNil, Flitz, Middleware, OptionsOrMiddlewares, RequestErrorHandler, RequestHandler, RequestHandlerOptions, RequestPath, RequestPathValidator } from '..';
import { asAsync } from '../_internals';

type GetFunc<T> = () => T;

export interface RequestHandlerContext {
  handler: RequestHandler;
  isPathValid: RequestPathValidator;
}

export type RequestHandlersGrouped = { [method: string]: RequestHandlerContext[] };

export interface WithMethodOptions {
  arguments: IArguments;
  flitz: Flitz;
  getErrorHandler: GetFunc<RequestErrorHandler>;
  groupedHandlers: RequestHandlersGrouped;
  method: string;
  recompileHandlers: () => void;
}

export function compileAllWithMiddlewares(
  groupedHandlers: RequestHandlersGrouped,
  middlewares: Middleware[],
  getErrorHandler: GetFunc<RequestErrorHandler>
): RequestHandlersGrouped {
  if (!middlewares.length) {
    return groupedHandlers;
  }

  const compiledHandlers: RequestHandlersGrouped = {};
  for (const method in groupedHandlers) {
    compiledHandlers[method] = groupedHandlers[method].map(ctx => {
      return {
        handler: mergeHandler(ctx.handler, middlewares, getErrorHandler),
        isPathValid: ctx.isPathValid
      };
    });
  }

  return compiledHandlers;
}

function isPathValidByRegex(path: RegExp) {
  return (req: IncomingMessage) => path.test(req.url!);
}

function isPathValidByString(path: string) {
  return (req: IncomingMessage) => req.url === path;
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

export function withMethod(opts: WithMethodOptions): Flitz {
  const path: RequestPath = opts.arguments[0];
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
  if (opts.arguments.length < 3) {
    // args[1]: RequestHandler
    handler = opts.arguments[1];
  } else {
    // args[1]: OptionsOrMiddlewares
    // args[2]: RequestHandler
    optionsOrMiddlewares = opts.arguments[1];
    handler = opts.arguments[2];
  }

  if (typeof handler !== 'function') {
    throw new TypeError('handler must be a function');
  }

  let options: RequestHandlerOptions;
  if (optionsOrMiddlewares) {
    if (Array.isArray(optionsOrMiddlewares)) {
      // list of middlewares
      options = {
        use: optionsOrMiddlewares
      };
    } else if (typeof optionsOrMiddlewares === 'function') {
      // single middleware
      options = {
        use: [optionsOrMiddlewares]
      };
    } else {
      // options object
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
      options.use.map(mw => asAsync<Middleware>(mw)),
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
    handler: asAsync<RequestHandler>(handler),
    isPathValid
  });
  opts.recompileHandlers();

  return opts.flitz;
}
