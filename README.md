[![npm](https://img.shields.io/npm/v/flitz.svg)](https://www.npmjs.com/package/flitz)

# flitz

*flitz* [[**ˈflɪt͡s**](https://en.wikipedia.org/wiki/Naming_conventions_of_the_International_Phonetic_Alphabet)] is a lightweight and extremly fast HTTP server with all basics for [Node 10+](https://nodejs.org/docs/latest-v10.x/api/http.html), wriiten in [TypeScript](https://www.typescriptlang.org/).

## Install

Run

```bash
npm install --save flitz
```

from the folder, where your `package.json` is stored.

## Usage

```javascript
const flitz = require('flitz').default;

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

## TypeScript

TypeScript is optionally supported. The module contains its own [definition files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

## License

MIT © [Marcel Kloubert](https://github.com/mkloubert)
