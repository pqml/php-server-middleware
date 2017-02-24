# php-middleware
Simple php connect-like middleware using the php built-in server

<br><br>

:warning: __This is experimental and only tested on OSX__ :warning:

<br><br>

### Examples

##### Usage with express
```js
const express = require('express')
const phpMiddleware = require('php-server-middleware')

const app = express()

app.use('/', phpMiddleware())
app.listen(3000)

```

<br><br>

### API Usage
#### `const middleware = phpMiddleware([options])`
Return a connect-like middleware function and auto-start the php server used by the middleware.

#### Options
##### `host` (String)
* Default: `'0.0.0.0'`
* The host the php server will listen on

##### `port` (Number)
* Default: `'35410'`
* The base port to use for the php server

##### `root` (String)
* Default: `process.cwd()`
* The document root of the php server

##### `verbose` (Boolean)
* Default: `false`
* Log additional informations

##### `quiet` (Boolean)
* Default: `false`
* If true, don't write anything to the console

<br><br>

### Todo
* `binary` option to use a path to a php binary to add Windows support