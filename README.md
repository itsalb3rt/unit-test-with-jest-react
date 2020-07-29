# Unit Test with Jest

This is a general purpose repository for integrated `Jest` with react projects.

The main idea is to cover the basic and elemental aspects of unit testing with industry standards for good practice and community support.

## Table of content

 - [Jest with any JS APP](#general)
 - [React and Jest](#react)
   - [Directory Structue](#directory-structure)
   - [Redux](#redux)
     - [Actions](#actions)
 - [Coverage](#coverage)
 - [Optional Jest configurations](#optional-jest-configurations)

## Get Started

## General

1 - Install `jest`.

```bash
$ npm i jest --save-dev
# And global install
$ npm i -g jst
```

2 - Add `jest` command to `package.json`.

```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
```

> run `npm run test:watch` to keep jest listening for all changes 

3 - All test live in `__test__` dir. [Docs](https://jestjs.io/docs/en/configuration).

4 - Now create the `global.test.js` this is the entry point for tests.

## Anatomy of test

The basic anatomy of test is separate the test in describe dections.

```javascript
const text = 'Hello World';

// The fist param in test method is a test description, this show in console when test is running

describe('String verification', () => {

  test('Check if contains a text', () => {
      // 
      expect(text).toMatch(/World/)
  });

});
```

---

# React

1 - Additional to install `jest` in your project and global, you need install `enzyme` *airbnb test tool* and `enzyme adapter`

```bash
$ npm i jest enzyme enzyme-adapter-react-16 --save-dev
```
> Note this is exclusive for react 16 [enzyme docs](https://github.com/enzymejs/enzyme)

2 - Now go to you `src` dir and created the `__test__` dir and `setupTest.js` with the init configutation.

```javascript
// src/__test__/setupTest.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

3 - Add `jest` command to `package.json`.

```json
// package.json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
```

and in the bottom of `package.json` added the following configuration. 

>This is for jest to recognize the enzyme adapters we add

```json
// package.json
  "jest":{
    "setupFilesAfterEnv":[
      "<rootDir>/src/__test__/setupTest.js"
    ]
  }
```

4 - Added `__mocks__` dir

`Jest` does not know how to handle the style files that our application has, that is why we will create a `mock` to prevent our tests on components with styles from failing.

create a dir `__mocks__` insede `src` and created the `styleMock.js`

```javascript
// src/__mocks__/styleMock.js
module.exports = {};
```

Finally add configuration in `package.json` to tell jest to use this mock.

```json
  "jest":{
    "moduleNameMapper": {
      "\\.(styl|css)$": "<rootDir>/src/__mocks__/styleMock.js"
    }
  }
```

---

## Redux

For work with `Redux` create a new `Mock` with name `ProviderMock.js`.

```javascript
//src/__mocks__/ProviderMock.js
import React from 'react';
import { createStore } from 'redux';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

// Import the store init state
import initialState from '../initialState';

// You reducers
import reducer from '../reducers';

const store = createStore(reducer, initialState);
const history = createBrowserHistory();

const ProviderMock = props => (
    <Provider store={store}>
        <Router history={history}>
            {props.children}
        </Router>
    </Provider>
);

export default ProviderMock;

```

This `mock` needs to be used in all your tests with` redux`

### Actions

To test actions we only have to have an example of our payload and name of the action

```javascript
// src/__test__/actions/actions.test.js
import actions from '../../actions';
import ProductMock from '../../__mocks__/ProductMock';

describe('Actions', () => {
    test('addToCart Action', () => {
        const payload = ProductMock; // example product object
        const expected = {
            type: 'ADD_TO_CART',
            payload,
        };
        expect(actions.addToCart(payload)).toEqual(expected);
    });
});
```

Original action.

```javascript
// src/actions/index.js
const addToCart = payload => ({
  type: 'ADD_TO_CART',
  payload,
});

const removeFromCart = payload => ({
  type: 'REMOVE_FROM_CART',
  payload,
});

const actions = {
  addToCart,
  removeFromCart,
};

export default actions;
```

---

## Render

With the render tests or better known as `snapshot` we can make sure that our UI does not change, for this we can use a react tool.

```bash
$ npm install react-test-renderer --save-d
```

A test looks like this.

```javascript
describe('Header Snapshot', () => {
    test('Check header Snapshot', () => {
        const header = create(
            <ProviderMock>
                <Header />
            </ProviderMock>
        );
        expect(header.toJSON()).toMatchSnapshot();
    });
});
```

> The example test use Redux

This will create a directory inside the test directory `__snapshots__`

If our UI changes for some reason the tests fail, then for this we only have to run a command in the console.

```bash
$ jest --updateSnapshot
```

## Directory Structure

The structure will always be given by our project, if we have a directory called `components` we must create this inside the` __test__` directory;

```bash
├──src
    ├──components # Your component dir
    ├──__mocks__ # mocks information
    ├──__test__
          ├──components # Your test component dir

```

---

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

---

## Optional Jest configurations

Activate jest `verbose` mode, to see the `titles` and `describe` of our tests.

```json
  "jest": {
    "verbose": true,
  }
```