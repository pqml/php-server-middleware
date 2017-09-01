const stacked = require('stacked')
const phpMiddleware = require('..')
const http = require('http')
const serveStatic = require('serve-static')

let app = stacked()
const serv = http.createServer(app)

const php = phpMiddleware({ onStart })

app.use(php)
app.use(serveStatic(process.cwd()))

function onStart() {
  serv.listen(35000, undefined, () => {
    console.log('server started on http://localhost:35000')
  })
}