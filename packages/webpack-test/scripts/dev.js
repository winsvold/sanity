const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevConfig = require('../webpack.dev.config')

const app = express()
const webpackCompiler = webpack(webpackDevConfig)

app.use(
  webpackDevMiddleware(webpackCompiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  })
)

app.use(webpackHotMiddleware(webpackCompiler))

app.get('*', (req, res) =>
  res.send(`<!DOCTYPE html>
<html>
  <div id="sanity"></div>
  <script src="/static/js/app.bundle.js"></script>
</html>
`)
)

app.listen('3333', err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  console.log(`Listening at http://localhost:3333`)
})
