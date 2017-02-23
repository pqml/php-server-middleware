'use strict'

const spawn = require('child_process').spawn
const commandExists = require('command-exists')
const getPort = require('./getPort')
const Emitter = require('events')

const DEF_OPTS = {
  bin: false,
  host: '0.0.0.0',
  port: 35410,
  root: process.cwd(),
  verbose: false,
  quiet: false
}

function server (opts) {
  opts = Object.assign({}, DEF_OPTS, opts || {})

  let usedPort = false
  let closed = false
  let started = false
  let handler

  const api = new Emitter()
  api.start = start
  api.close = close
  api.isStarted = function () { return started }
  return api

  function log (msg, force) {
    if ((!opts.verbose && !force) || opts.quiet) return
    process.stdout.write('[php] ' + msg)
  }

  function handleData (data) {
    if (closed && !started) return
    if (closed) return close()
    log(data)
    api.emit('data', { data: data })
  }

  function startProcess () {
    return new Promise((resolve, reject) => {
      getPort(opts.port)
        .then(resolvedPort => {
          usedPort = resolvedPort
          const addr = opts.host + ':' + usedPort
          handler = spawn('php', ['-S', addr, '-t', opts.root])
          handler.stdout.on('data', handleData)
          handler.stderr.on('data', handleData)
          handler.on('close', code => {
            log('Server closed.\n')
            api.emit('close', { code: code })
          })
          if (!started) {
            started = true
            log('Server started on port ' + usedPort + '.\n')
            api.emit('start', { port: usedPort })
          }
        })
        .catch(reject)
    })
  }

  function start () {
    return new Promise((resolve, reject) => {
      commandExists('php')
        .then(() => startProcess())
        .catch(() => {
          reject(new Error('php is not installed on your system.'))
        })
    })
  }

  function close () {
    closed = true
    if (!handler || !started) return
    started = false
    handler.kill()
  }
}

module.exports = server
