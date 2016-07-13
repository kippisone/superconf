'use strict';

// let cs = require('coffee-script');
let CoffeeScript = require('coffee-script').compile;
let fs = require('fs');
let path = require('path');
let yaml = require('yaml');

class Superconf {
  constructor(opts) {
    opts = opts || {};

    this.files = [
      '%s.json',
      '%s.cson',
      '%s.yaml',
      '.%src',
      'package.json'
    ]

    this.cwd = opts.cwd || process.cwd();
  }

  getFirstExisting(name) {
    for (let file of this.files) {
      let filepath = path.join(this.cwd, file.replace('%s', name));
      try {
        fs.accessSync(filepath);
        return filepath;
      } catch (err) {

      }
    }

    return null;
  }

  tryFiles(name) {
    if (!name) {
      throw new Error('Name arg must be set!');
    }

    let confFile = this.getFirstExisting(name);

    if (!confFile) {
      return null;
    }

    let ext = path.extname(confFile);
    let json;

    try {
      if (ext === '.json') {
        json = require(confFile);
        if (file === 'package.json') {
          json = json[name];
        }
      }
      else {
        let source = fs.readFileSync(confFile, { encoding: 'utf8' });

        if (ext === '.cson') {
          let js = CoffeeScript('module.exports =\n' + source);
          let sandbox = {
            module: {}
          };

          let module = {};
          eval(js);
          json = module.exports;
        }
        else if (ext === '.yaml') {
          json = yaml.eval(source);
        }
        else {
          let source = fs.readFileSync(confFile, { encoding: 'utf8' });
          eval('json = ' + source);
        }
      }
    }
    catch (err) {
      throw new SyntaxError('Could not parse config file: ' + confFile + '\n\n' + err);
    }

    if (json) {
      return json;
    }
  }
}

module.exports = function(name, opts) {

  let sc = new Superconf(opts);
  return sc.tryFiles(name);

};
