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

import { IncomingMessage, ServerResponse } from 'http';
import { NotFoundHandler, RequestErrorHandler } from '.';

/**
 * The default error handler.
 */
export const defaultErrorHandler: RequestErrorHandler = async (err: any, req: IncomingMessage, res: ServerResponse): Promise<any> => {
  console.error('[flitz]', err);

  if (!res.headersSent) {
    res.writeHead(500);
  }

  res.end();
};

/**
 * The default 'not found' handler.
 */
export const defaultNotFoundHandler: NotFoundHandler = async (req: IncomingMessage, res: ServerResponse): Promise<any> => {
  res.writeHead(404);
  res.end();
};
