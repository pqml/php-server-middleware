'use strict'

const stacked = require('stacked')
const phpServerMiddleware = require('..')
const http = require('http')

let app = stacked()

let phpServer = phpServerMiddleware()
app.use(phpServer.middleware)

const serv = http.createServer(app)
serv.listen(35000, undefined, () => {
  console.log('server started on http://localhost:35000')
})
