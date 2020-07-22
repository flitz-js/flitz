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

import fs from 'fs';
import path from 'path';
import { Flitz, RequestHandler, RequestPathValidator } from '../server';

interface AddStaticOptions {
  basePath: string;
  cache: boolean;
  flitz: Flitz;
  rootDir: string;
}

type FileWithData = { [path: string]: Buffer };

export function addStatic(opts: AddStaticOptions) {
  if (typeof opts.basePath !== 'string') {
    throw new TypeError('basePath must be a function');
  }

  if (typeof opts.rootDir !== 'string') {
    throw new TypeError('rootDir must be a function');
  }

  let rootDir = opts.rootDir;
  if (!path.isAbsolute(rootDir)) {
    rootDir = path.join(process.cwd(), rootDir);
  }

  let handler: RequestHandler;
  if (opts.cache) {
    handler = createStaticHandlerCached(rootDir, opts.basePath);
  } else {
    handler = createStaticHandler(rootDir);
  }

  opts.flitz.get(
    createStaticPathValidator(opts.basePath),
    handler
  );
}

function createStaticHandler(rootDir: string): RequestHandler {
  return async (req, res) => {
    const fullPath = path.join(rootDir, req.url!);

    if (fs.existsSync(fullPath)) {
      if ((await fs.promises.stat(fullPath)).isFile()) {
        fs.createReadStream(fullPath)
          .pipe(res);

        return;
      }
    }

    res.writeHead(404);
    res.end();
  };
}

function createStaticHandlerCached(rootDir: string, basePath: string): RequestHandler {
  const files: FileWithData = {};
  loadFiles(rootDir, files, rootDir, basePath);

  return async (req, res) => {
    const data = files[req.url!];
    if (data) {
      res.writeHead(200);
      res.write(data);
    } else {
      res.writeHead(404);
    }

    res.end();
  };
}

function createStaticPathValidator(basePath: string): RequestPathValidator {
  return (req) => req.url!.startsWith(basePath);
}

function loadFiles(dir: string, files: FileWithData, rootDir: string, basePath: string) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
      .split(path.sep)
      .join('/');

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      loadFiles(fullPath, files, rootDir, basePath);
    } else if (stats.isFile()) {
      const bpSuffix = basePath.endsWith('/') ? '' : '/';
      const key = basePath + bpSuffix + path.relative(rootDir, fullPath)
        .split(path.sep)
        .join('/');

      files[key] = fs.readFileSync(fullPath);
    }
  }
}
