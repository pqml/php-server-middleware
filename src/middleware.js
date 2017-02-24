'use strict'

const url = require('url')
const path = require('path')
const proxy = require('http-proxy-middleware')
const phpServer = require('./server')
const callStable = require('./call-stable')
const fs = require('fs')

const PHP_EXTS = ['.php', '.php5']
const DEF_OPTS = {
  host: '0.0.0.0',
  port: 35410,
  root: process.cwd(),
  verbose: false
}

function createMiddleware (opts) {
  opts = Object.assign({}, DEF_OPTS, opts || {})

  let handler = null
  const serv = phpServer(opts)
  serv.middleware = middleware

  const startServer = callStable(serv.start, () => {
    throw new Error('Php built-in server closes too often.')
  })

  serv.on('start', (data) => {
    handler = proxy({
      target: 'http://' + opts.host + ':' + data.port,
      logLevel: opts.verbose ? 'info' : 'silent'
    })
  })

  serv.on('close', (data) => {
    startServer()
  })

  startServer()
  return middleware

  function middleware (req, res, next) {
    if (!handler) return next()

    let pathname = url.parse(req.url).pathname
    const filepath = path.join(opts.root, pathname)

    fs.stat(filepath, (err, stats) => {
      if (err) return next()
      if (stats.isDirectory()) {
        fs.stat(path.join(filepath, 'index.php'), (err, stats) => {
          if (err || !stats.isFile()) return next()
          return handler(req, res, next)
        })
      } else if (stats.isFile()) {
        const ext = path.extname(pathname)
        if (PHP_EXTS.indexOf(ext) === -1) return next()
        return handler(req, res, next)
      } else {
        return next()
      }
    })
  }
}

module.exports = createMiddleware
