Superconf
=========

Superconf is a configuration loader for Node.js.
It supports `json`, `cson`, yaml`, `.rc` or `package.json` config formats.

## Usage

```js
let superconf = require('superconf');
let conf = superconf('myconf');

```

This command loads a configuration from current working dir.
Superconf tries to load configurations in this order:

<name>.json
<name>.cson
<name>.yaml
.<name>rc
package.json (returns <name> property)

## Merge configs

Superconf comes with a merge method. Morge is similar to Object.assign() or lodash.extend().
Its a configurable merge method which merges multiple configurations together.

This method was implemented because Object.assign or lodash.extend handle `undefined` or `null` properties differently.

### *static* merge(left, right[, ...args])

```js
let left = {
  fruit: 'Apple',
  vegetable: 'Carrot'
};

let right = {
  fruit: 'Banana',
  vegetable: undefined
};

let assgned = Object.assign({}, left, right);
// assgned === {
//   fruit: 'Banana'.
//   vegetable: undefined
// }

let conf = superconf.merge(left, right);
// conf === {
//   fruit: 'Banana',
//   vegetable: 'Carrot'
// }

```

#### Configure merge

Merge behavior can be changed.

A static `config()` method can be used to change merge begavior.

```js
let left = {
  fruits: {
    red: 'Apple'
  },
  vegetable: 'Carrot'
};

let right = {
  fruits: {
    yellow: 'Banana'
  },
  vegetable: undefined
};

let conf = superconf.merge(left, right);
// conf === {
//   fruits: {
//     yellow: 'Banana'
//   },
//   vegetable: 'Carrot'
// }

let conf = superconf.config({
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
