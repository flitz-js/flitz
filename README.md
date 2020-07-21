[![npm](https://img.shields.io/npm/v/flitz.svg)](https://www.npmjs.com/package/flitz) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/flitz-js/flitz/pulls)

# flitz

> *flitz* [[**ˈflɪt͡s**](https://en.wikipedia.org/wiki/Naming_conventions_of_the_International_Phonetic_Alphabet)] is a lightweight and extremly fast HTTP server with all basics for [Node 10+](https://nodejs.org/docs/latest-v10.x/api/http.html), written in [TypeScript](https://www.typescriptlang.org/).

## Install

Run

```bash
npm install --save flitz
```

from the folder, where your `package.json` is stored.

## Usage

```javascript
const flitz = require('flitz');

const run = async () => {
  const app = flitz();

  app.get('/', async (req, res) => {
    res.write('Hello world!');
    res.end();
  });

  await app.listen(3000);
};

run();
```

Or the TypeScript way:

```typescript
import flitz from 'flitz';

const run = async () => {
  const app = flitz();

  app.get('/', async (req, res) => {
    res.write('Hello world!');
    res.end();
  });

  await app.listen(3000);
};

run();
```

### Middlewares

```typescript
import flitz from 'flitz';
// s. https://github.com/flitz-js/body
import { body } from '@flitz/body';

const run = async () => {
  const app = flitz();

  //             👇👇👇
  app.post('/', [ body() ], async (req, res) => {
    const body = req.body as Buffer;

    res.write('Your body as string: ' + body.toString('utf8'));
    res.end();
  });

  await app.listen(3000);
};

run();
```

### Static files

```typescript
import flitz from 'flitz';

const run = async () => {
  const app = flitz();

  app.static('/', '/path/to/my/local/files/to/serve');

  await app.listen(3000);
};

run();
```

## TypeScript

TypeScript is optionally supported. The module contains its own [definition files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

## License

MIT © [Marcel Kloubert](https://github.com/mkloubert)
