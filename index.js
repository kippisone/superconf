'use strict'

const CoffeeScript = require('coffee-script').compile
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

class Superconf {
  constructor (opts) {
    opts = opts || {}

    this.files = opts.files || [
      '%s.json',
      '%s.cson',
      '%s.yaml',
      '%s.yml',
      '.%src',
      '.%src.json',
      '.%src.cson',
      '.%src.yaml',
      '.%src.yml',
      'package.json'
    ]

    if (opts.defaultConf) {
      this.files.push(opts.defaultConf)
    }

    this.cwd = opts.cwd || process.cwd()
  }

  getFirstExisting (name) {
    for (let file of this.files) {
      let filepath = path.resolve(this.cwd, file.replace('%s', name))
      try {
        fs.accessSync(filepath)
        if (file === 'package.json') {
          const json = require(filepath)
          if (json[name]) return filepath
        } else {
          return filepath
        }
      } catch (err) {

      }
    }

    return null
  }

  tryFiles (name) {
    if (!name) {
      throw new Error('Name arg must be set!')
    }

    let confFile = this.getFirstExisting(name)

    if (!confFile) {
      return null
    }

    let ext = path.extname(confFile)
    let json

    try {
      if (ext === '.json') {
        json = require(confFile)
        if (path.basename(confFile) === 'package.json') {
          json = json[name]
        }
      } else {
        let source = fs.readFileSync(confFile, { encoding: 'utf8' })

        if (ext === '.cson') {
          let js = CoffeeScript('module.exports =\n' + source)
          let module = {}
          eval(js) // eslint-disable-line no-eval
          json = module.exports
        } else if (ext === '.yaml' || ext === '.yml') {
          json = yaml.safeLoad(source)
        } else {
          let source = fs.readFileSync(confFile, { encoding: 'utf8' })
          eval('json = ' + source) // eslint-disable-line no-eval
        }
      }
    } catch (err) {
      throw new SyntaxError('Could not parse config file: ' + confFile + '\n\n' + err)
    }

    if (json) {
      return json
    }
  }

  config (conf) {
    this.mergeConf = {
      dept: conf.dept || 0
    }

    return this
  }

  copy (obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.copy(item))
    }

    const copied = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === null) {
          copied[key] = null
          continue
        }

        if (Array.isArray(obj[key])) {
          copied[key] = obj[key].map((item) => this.copy(item))
          continue
        }

        if (typeof obj[key] === 'object') {
          copied[key] = this.copy(obj[key])
          continue
        }

        copied[key] = obj[key]
      }
    }

    return copied
  }

  merge () {
    let conf = {}
    let args = Array.prototype.slice.call(arguments)

    let dept = this.mergeConf ? this.mergeConf.dept : 0

    let merge = function (left, right, curdept) {
      if (left === undefined || left === null) {
        left = {}
      }

      if (typeof right !== 'object') {
        return left
      }

      for (let key in right) {
        if (right.hasOwnProperty(key)) {
          if (right[key] === undefined) {
            continue
          }

          if (right[key] === null) {
            left[key] = null
            continue
          }

          if (Array.isArray(right[key])) {
            left[key] = right[key].map(item => {
              if (typeof item === 'object') {
                return JSON.parse(JSON.stringify())
              }

              return item
            })
            continue
          }

          if (typeof right[key] === 'object') {
            if (curdept) {
              left[key] = merge(left[key], right[key], left[key]--)
              continue
            }

            left[key] = Object.assign({}, right[key])
            continue
          }

          left[key] = right[key]
        }
      }

      return left
    }

    for (let i = 0; i < args.length; i++) {
      conf = merge(conf, args[i], dept)
    }

    return conf
  }
}

module.exports = function (name, opts) {
  let sc = new Superconf(opts)
  return sc.tryFiles(name)
}

module.exports.config = function (conf) {
  let sc = new Superconf()
  return sc.config(conf)
}

module.exports.merge = Superconf.prototype.merge
module.exports.copy = Superconf.prototype.copy.bind(Superconf.prototype)
