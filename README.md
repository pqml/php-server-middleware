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

##### `headersRewrite` (Boolean)
* Default: `true`
* Rewrites the location host/port on (301/302/307/308) redirects based on requested host/port.

##### `bodyRewrite` (Boolean)
* Default: `true`
* Replace all `proxyHost:proxyPort` by `requestedHost:requestedPort` from the response body
* Works only for these MIME-types:
    - text/html
    - text/css
    - text/xml
    - text/javascript
    - application/javascript
    - application/json

##### `handle404` (Boolean)
* Default: `true`
* Let php handle not-found paths - basically allowing you to use .htaccess features like url-rewriting

##### `proxyOpts` (Object)
* Default: `{}`
* [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware) options

##### `verbose` (Boolean)
* Default: `false`
* Log additional informations

##### `quiet` (Boolean)
* Default: `false`
* If true, don't write anything to the console

<br><br>

### Todo
* `binary` option to use a path to a php binary to add Windows support