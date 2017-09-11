'use strict'

const path = require('path')

const inspect = require('inspect.js')
const superconf = require('../index.js')

process.chdir(path.join(__dirname, '/fixtures/'))

describe('Superconf', () => {
  describe('JSON', () => {
    it('Should load a JSON conf', () => {
      let conf = superconf('jsontest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })

    it('Should load a CSON conf', () => {
      let conf = superconf('csontest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })

    it('Should load a YAML conf', () => {
      let conf = superconf('yamltest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })

    it('Should load a YML conf', () => {
      let conf = superconf('ymltest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })

    it('Should load a RC file', () => {
      let conf = superconf('rctest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })

    it('Should load from package.json', () => {
      let conf = superconf('pkgtest')
      inspect(conf).isObject()
      inspect(conf).isEql({
        foo: 'bar',
        bla: 'blub'
      })
    })
  })

  describe('merge', function () {
    it('Should merge object using Object.assign()', function () {
      let left = {
        fruit: 'Apple',
        vegetable: 'Carrot'
      }

      let right = {
        fruit: 'Banana',
        vegetable: undefined
      }

      let conf = Object.assign(left, right)
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetable: undefined
      })
    })

    it('Should merge config objects', function () {
      let left = {
        fruit: 'Apple',
        vegetable: 'Carrot'
      }

      let right = {
        fruit: 'Banana',
        vegetable: undefined
      }

      let conf = superconf.merge(left, right)
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetable: 'Carrot'
      })
    })

    it('Should overwrite objects', function () {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: 'Tomato',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      }

      let right = {
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      }

      let conf = superconf.merge(left, right)
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      })
    })

    it('Should overwrite arrays', function () {
      let left = {
        fruit: 'Apple',
        vegetables: [
          'Tomato',
          'Curcumber',
          'Red cabbage'
        ]
      }

      let right = {
        fruit: 'Banana',
        vegetables: [
          'Capsicum'
        ]
      }

      let conf = superconf.merge(left, right)
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: [
          'Capsicum'
        ]
      })
    })

    it('Should merge the first level together', function () {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: 'Tomato',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      }

      let right = {
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      }

      let conf = superconf.config({
        dept: 1
      }).merge(left, right)

      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      })
    })

    it('Should merge the first level together, using arrays', function () {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: [
            'Tomato',
            'Capsicum'
          ]
        }
      }

      let right = {
        fruit: 'Banana',
        vegetables: {
          green: [
            'Curcumber'
          ]
        }
      }

      let conf = superconf.config({
        dept: 1
      }).merge(left, right)
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: ['Tomato', 'Capsicum'],
          green: ['Curcumber']
        }
      })
    })
  })

  describe('copy()', () => {
    it('copies a config object', () => {
      const obj = {
        foo: 'foo',
        bar: 'bar',
        bla: {
          blub: 123
        }
      }

      const copied = superconf.copy(obj)
      inspect(copied).isEql(obj)
      inspect(copied).isNotEqual(obj)
      inspect(copied.bla).isNotEqual(obj.bla)
    })

    it('copies a config object with an array', () => {
      const three = {
        number: {
          digit: 3
        }
      }

      const obj = {
        foo: 'foo',
        bar: 'bar',
        bla: [
          'one',
          'zwo',
          three
        ]
      }

      const copied = superconf.copy(obj)
      inspect(copied).isEql(obj)
      inspect(copied).isNotEqual(obj)
      inspect(copied.bla).isArray().hasLength(3)
      inspect(copied.bla).isNotEqual(obj.bla)
      inspect(copied.bla[2]).isEql(three).isNotEqual(three)
    })

    it('copies a config object with all existing shit', () => {
      const three = {
        number: {
          digit: 3,
          str: 'three',
          used: null,
          none: undefined
        }
      }

      const obj = {
        foo: 'foo',
        bar: 'bar',
        bla: [
          'one',
          'zwo',
          three,
          123,
          null,
          undefined,
          ['sub-one']
        ]
      }

      const copied = superconf.copy(obj)
      inspect(copied).isEql(obj)
      inspect(copied).isNotEqual(obj)
      inspect(copied.bla).isArray().hasLength(7)
      inspect(copied.bla).isNotEqual(obj.bla)
      inspect(copied.bla[2]).isEql(three).isNotEqual(three)
    })
  })
})
