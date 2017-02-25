'use strict'

const url = require('url')
const path = require('path')
const proxy = require('http-proxy-middleware')
const phpServer = require('./server')
const callStable = require('./call-stable')
const fs = require('fs')

const WRITEABLE_MIME_TYPES = [
  'text/html',
  'text/css',
  'text/xml',
  'text/javascript',
  'application/javascript',
  'application/json'
]
const PHP_EXTS = ['.php', '.php5']
const DEF_OPTS = {
  host: '0.0.0.0',
  port: 35410,
  root: process.cwd(),
  verbose: false,
  headersRewrite: true,
  bodyRewrite: false,
  handle404: true,
  proxyOpts: {}
}

function createMiddleware (opts) {
  opts = Object.assign({}, DEF_OPTS, opts || {})

  let proxyAddr = ''
  let proxyMiddleware = null
  const serv = phpServer(opts)
  serv.middleware = middleware

  const startServer = callStable(serv.start, () => {
    throw new Error('Php built-in server closes too often.')
  })

  serv.on('start', (data) => {
    proxyAddr = opts.host + ':' + data.port
    proxyMiddleware = proxy(Object.assign({
      target: 'http://' + proxyAddr,
      logLevel: opts.verbose ? 'info' : 'silent',
      autoRewrite: opts.headersRewrite,
      changeOrigin: true
    }, opts.proxyOpts))
  })

  serv.on('close', (data) => {
    startServer()
  })

  startServer()
  return middleware

  function handle (req, res, next) {
    if (opts.bodyRewrite) {
      var _write = res.write
      res.write = function (data) {
        let contentType = res.getHeader('content-type')
        if (!contentType) return _write.call(res, data)
        contentType = contentType.trim().split(';')[0] || ''
        if (WRITEABLE_MIME_TYPES.indexOf(contentType) !== -1) {
          _write.call(res, data.toString()
            .split(proxyAddr)
            .join(req.headers.host))
        } else {
          _write.call(res, data)
        }
      }
    }
    proxyMiddleware(req, res, next)
  }

  function middleware (req, res, next) {
    if (!proxyMiddleware) return next()

    let pathname = url.parse(req.url).pathname
    const filepath = path.join(opts.root, pathname)

    fs.stat(filepath, (err, stats) => {
      // the file does not exist
      if (err) {
        if (opts.handle404) {
          return handle(req, res, next)
        } else {
          return next()
        }
      }
      // if it's a directory, check for index.php
      if (stats.isDirectory()) {
        fs.stat(path.join(filepath, 'index.php'), (err, stats) => {
          if (err || !stats.isFile()) return next()
          return handle(req, res, next)
        })
      // if it's a file, check for if it's a php file
      } else if (stats.isFile()) {
        const ext = path.extname(pathname)
        if (PHP_EXTS.indexOf(ext) === -1) return next()
        return handle(req, res, next)
      } else {
        return next()
      }
    })
  }
}

module.exports = createMiddleware
