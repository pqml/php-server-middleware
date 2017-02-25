'use strict'

const stacked = require('stacked')
const phpMiddleware = require('..')
const http = require('http')
const serveStatic = require('serve-static')

let app = stacked()
const serv = http.createServer(app)

app.use(phpMiddleware({ bodyRewrite: true }))
app.use(serveStatic(process.cwd()))

serv.listen(35000, undefined, () => {
  console.log('server started on http://localhost:35000')
})
