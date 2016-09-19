'use strict';
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
      '%s.yml',
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
        if (path.basename(confFile) === 'package.json') {
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

  config(conf) {
    this.mergeConf = {
      dept: conf.dept || 0
    }

    return this;
  }

  merge() {
    let conf = {};
    let args = Array.prototype.slice.call(arguments);

    let dept = this.mergeConf ? this.mergeConf.dept : 0;

    let merge = function(left, right, curdept) {
      if (left === undefined) {
        left = {};
      }

      if (typeof right !== 'object') {
        return left;
      }

      for (let key in right) {
        if (right.hasOwnProperty(key)) {
          if (right[key] === undefined) {
            continue;
          }

          if (right[key] === null) {
            left[key] = null;
            continue;
          }

          if (Array.isArray(right[key])) {
            left[key] = right[key].map(item => {
              if (typeof item === 'object') {
                return JSON.parse(JSON.stringify());
              }

              return item;
            });
            continue;
          }

          if (typeof right[key] === 'object') {
            if (curdept) {
              left[key] = merge(left[key], right[key], left[key]--);
              continue;
            }

            left[key] = Object.assign({}, right[key]);
            continue;
          }

          left[key] = right[key];
        }
      }

      return left;
    }

    for (let i = 0; i < args.length; i++) {
      conf = merge(conf, args[i], dept);
    }

    return conf;
  }
}

module.exports = function(name, opts) {
  let sc = new Superconf(opts);
  return sc.tryFiles(name);
};

module.exports.config = function(conf) {
  let sc = new Superconf();
  return sc.config(conf);
};

module.exports.merge = Superconf.prototype.merge;
