'use strict'

const stacked = require('stacked')
const phpMiddleware = require('..')
const http = require('http')

let app = stacked()
app.use(phpMiddleware())

const serv = http.createServer(app)
serv.listen(35000, undefined, () => {
  console.log('server started on http://localhost:35000')
})
