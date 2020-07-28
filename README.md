# Unit Test with Jest

## Get Started

Install `jest`.

```bash
$ npm i jest --save-dev
# And global install
$ npm i -g jst
```

Add `jest` command to `package.json`.

```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
```

> run `npm run test:watch` to keep jest listening for all changes 

All test live in `__test__` dir. [Docs](https://jestjs.io/docs/en/configuration).

Now create the `global.test.js` this is the entry point for tests.

## Anatomy

```javascript
const text = 'Hola mundo';

// The fist param in test method is a test description, this show in console when test is running
test('Debe contener un texto', () => {
    // 
    expect(text).toMatch(/Mundo/)
});
```

## Coverage

Check how much code of your application you have already tested.

```bash
$ jest --coverage
```

This generates a console report like this.

```bash
PASS src/__test__/global.test.js
PASS src/__test__/index.test.js
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |      60 |        0 |   33.33 |      60 |
 index.js |      60 |        0 |   33.33 |      60 | 10-14
----------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        8.775 s
Ran all test suites.

```

This also generates a directory in our project called `coverage`. Inside this dir you have `Icov-report` dir with `index.html` file, open this and check your coverage report with css :smile:

> Added `coverage` dir to gitignore