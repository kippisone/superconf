Superconf
=========

[![Build Status](https://travis-ci.org/Andifeind/superconf.svg?branch=master)](https://travis-ci.org/Andifeind/superconf)

Superconf is a smart configuration loader for Node.js.
It supports `json`, `cson`, `yaml`, `.rc` or `package.json` config formats.

## Usage

```js
const superconf = require('superconf');
const conf = superconf('myconf');
```

This command loads a configuration from current working dir.
Superconf tries to load configurations in this order:

* ${name}.json
* ${name}.cson
* ${name}.yaml
* ${name}.yml
* .${name}rc
* package.json (returns ${name} property)

## Options

### `files` overwrites the files array

```js
const opts = {
  files: ['config/development.json', 'config/development.yml']
}

const conf = superconf('myconf', opts)
```

### `cwd` set the current working dir

```js
const opts = {
  cwd: `${process.cwd()}/config`
}

const conf = superconf('myconf', opts)
```


## Merge configs

Superconf comes with a merge method. Morge is similar to Object.assign() or lodash.extend().
Its a configurable merge method which merges multiple configurations together.

This method was implemented because Object.assign or lodash.extend handle `undefined` or `null` properties differently.

### *static* merge(left, right[, ...args])

```js
const left = {
  fruit: 'Apple',
  vegetable: 'Carrot'
};

const right = {
  fruit: 'Banana',
  vegetable: undefined
};

const assgned = Object.assign({}, left, right);
// assgned === {
//   fruit: 'Banana'.
//   vegetable: undefined
// }

const conf = superconf.merge(left, right);
// conf === {
//   fruit: 'Banana',
//   vegetable: 'Carrot'
// }

```

#### Configure merge

Merge behavior can be changed.

A static `config()` method can be used to change merge begavior.

```js
const left = {
  fruits: {
    red: 'Apple'
  },
  vegetable: 'Carrot'
};

const right = {
  fruits: {
    yellow: 'Banana'
  },
  vegetable: undefined
};

const conf = superconf.merge(left, right);
// conf === {
//   fruits: {
//     yellow: 'Banana'
//   },
//   vegetable: 'Carrot'
// }

const conf = superconf.config({
  dept: 1
}).merge(left, right);
// conf === {
//   fruits: {
//     red: 'Apple',
//     yellow: 'Banana'
//   },
//   vegetable: 'Carrot'
// }
```
This will merge objects together, but only on the first level.

## Copy configs

The `.copy()` method returns a deep copy of the input object. It traverse through all objects and arrays and creates new copies of all objects and arrays.

### *static* copy(*any* obj)

```js
const obj = {
  foo: 'foo',
  bar: {
    bla: 'bla'
  }
}

const copy = superconf.copy(obj)

obj !== copy // true
obj.bar !== copy.bar // true
```
