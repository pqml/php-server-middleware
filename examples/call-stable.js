'use strict'

const callStable = require('../src/call-stable.js')

const run = callStable(
  () => { console.log('> stable') },
  () => { console.log('> unstable') }
)

run()
run()
run()
run()
run()
run()
setTimeout(run, 4000)
