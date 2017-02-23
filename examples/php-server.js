'use strict'

const server = require('../src/server')

const php = server({
  verbose: true
})

php.on('start', res => {
  console.log('start event. the server will close in 10 sec.')
  setTimeout(() => {
    php.close()
  }, 10000)
})

php.on('data', res => {
  console.log('new data')
})

php.start()
