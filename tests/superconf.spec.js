'use strict';

let inspect = require('inspect.js');
let superconf = require('../index.js');

process.chdir(__dirname + '/fixtures/');

describe('Superconf', () => {
  describe('JSON', () => {
    it('Should load a JSON conf', () => {

      let conf = superconf('jsontest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a CSON conf', () => {

      let conf = superconf('csontest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a YAML conf', () => {

      let conf = superconf('yamltest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load a RC file', () => {

      let conf = superconf('rctest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });

    it('Should load from package.json', () => {

      let conf = superconf('pkgtest');
      inspect(conf).isObject();
      inspect(conf).isEql({
        foo: 'bar'
      });
    });
  });

  describe('merge', function() {
    it('Should merge object using Object.assign()', function() {
      let left = {
        fruit: 'Apple',
        vegetable: 'Carrot'
      };

      let right = {
        fruit: 'Banana',
        vegetable: undefined
      };

      let conf = Object.assign(left, right);
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetable: undefined
      });
    });

    it('Should merge config objects', function() {
      let left = {
        fruit: 'Apple',
        vegetable: 'Carrot'
      };

      let right = {
        fruit: 'Banana',
        vegetable: undefined
      };

      let conf = superconf.merge(left, right);
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetable: 'Carrot'
      });
    });

    it('Should overwrite objects', function() {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: 'Tomato',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      };

      let right = {
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      };

      let conf = superconf.merge(left, right);
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      });
    });

    it('Should overwrite arrays', function() {
      let left = {
        fruit: 'Apple',
        vegetables: [
          'Tomato',
          'Curcumber',
          'Red cabbage'
        ]
      };

      let right = {
        fruit: 'Banana',
        vegetables: [
          'Capsicum'
        ]
      };

      let conf = superconf.merge(left, right);
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: [
          'Capsicum'
        ]
      });
    });

    it('Should merge the first level together', function() {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: 'Tomato',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      };

      let right = {
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum'
        }
      };

      let conf = superconf.config({
        dept: 1
      }).merge(left, right);

      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: 'Capsicum',
          green: 'Curcumber',
          blue: 'Red cabbage'
        }
      });
    });

    it('Should merge the first level together, using arrays', function() {
      let left = {
        fruit: 'Apple',
        vegetables: {
          red: [
            'Tomato',
            'Capsicum'
          ]
        }
      };

      let right = {
        fruit: 'Banana',
        vegetables: {
          green: [
            'Curcumber'
          ]
        }
      };

      let conf = superconf.config({
        dept: 1
      }).merge(left, right);
      inspect(conf).isEql({
        fruit: 'Banana',
        vegetables: {
          red: ['Tomato', 'Capsicum'],
          green: ['Curcumber']
        }
      });
    });
  });
});
