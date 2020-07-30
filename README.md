# Unit Test React with Jest

This is a general purpose repository for integrated `Jest` with react projects.

The main idea is to cover the basic and elemental aspects of unit testing with industry standards for good practice and community support.

## Table of content

 - [React and Jest](#react)
   - [Directory Structue](#directory-structure)
   - [Anatomy of test](#anatomy-of-test)
   - [Redux](#redux)
     - [Actions](#actions)
     - [Reducers](#reducers)
     - [Render](#render)
 - [Coverage](#coverage)
 - [Optional Jest configurations and commands](#optional-jest-configurations)
 - [Posible problems](#posible-problems)

## Get Started

# React

1 -Install `jest` in your project and global.

:warning: Check first if your app using `react-script` dependency for install `Jest` version according to your `react-script` version.

```bash
$ npm install jest --save-dev
# And global install
$ npm install -g jest
```

 Now you need install `enzyme` *airbnb test tool* and `enzyme adapter`

```bash
$ npm install jest enzyme enzyme-adapter-react-16 --save-dev
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


## Directory Structure

The structure will always be given by our project, if we have a directory called `components` we must create this inside the ` __test__` directory;

```bash
├──src
    ├──components # Your component dir
    ├──__mocks__ # mocks information
    ├──__test__
          ├──components # Your test component dir

```

---

## Anatomy of test

The basic anatomy of test is separate the test in describe sections.

```javascript
// src/__test__/components/PrintString.js
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

### Reducers

The tests for reducers are similar to those for actions.

```javascript
// src/__test__/reducers/reducers.test.js
import reducer from '../../reducers';
import ProductMock from '../../__mocks__/ProductMock';

describe('Reducers', () => {
    test('Return initial State', () => {
        //This "pass" because we pass an empty object to reduce in the expect
        // And the reducer return this empty object if action not exists 
        // (second param in reducer)
        expect(reducer({}, '')).toEqual({});
    });

    test('ADD_TO_CARD', () => {
        const initialState = {
            cart: []
        };
        const payload = ProductMock;
        const action = {
            type: 'ADD_TO_CART',
            payload
        };
        const expected = {
            cart: [
                ProductMock
            ]
        };

        expect(reducer(initialState,action)).toEqual(expected);
    })
});
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
---

## Fetch

To test requests to an API we must install a development dependency that `Jest` provides.

```bash
$ npm install jest-fetch-mock --save-dev
```

Now to go you `setupTest.js` and add the configuration.

```javascript
// src/__test__/setupTest.js
global.fetch = require('jest-fetch-mock');
```

```javascript
// src/__test__/util/getData.test.js
import getData from '../../util/getData';

describe('Fetch API', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    test('Request data API', () => {
        fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));

        getData('https://google.com') // fill this with any, is required but not relevant
        .then(response => {
            expect(response.data).toEqual('12345')
        });

        expect(fetch.mock.calls[0][0]).toEqual('https://google.com')
    })
});
```

Original `getData.js`.

```javascript
const getData = (api) => {
    return fetch(api)
        .then(response => response.json())
        .then(response => response)
        .catch(error => error)
}

export default getData;
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

## Optional Jest configurations and commands

**Verbose**

Activate jest `verbose` mode, to see the `titles` and `describe` of our tests.

```json
  "jest": {
    "verbose": true,
  }
```

**Run one test**

```bash
# Local
$ npx jest src/__test__/components/Footer.test.js

# Or using jest Globally
$ jest src/__test__/components/Footer.test.js
```

---

## Posible problems

**Cannot use import statement outside a module.**

Create `babel.config.json` and add `@babel/preset-env` present.

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

and install package.

```bash
$ npm install jest babel-jest @babel/preset-env --save-dev
```

**Plugin/Preset files are not allowed to export objects, only functions.**

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/react" <--- add this
  ]
}
```

And install `@babel/preset-react` preset

```bash
$ npm install @babel/preset-react --save-dev
```