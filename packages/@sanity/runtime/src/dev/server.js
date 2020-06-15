'use strict'

/* eslint-disable no-console */

const express = require('express')
const ReactDOMServer = require('react-dom/server')
const {Observable} = require('rxjs')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const {getDocumentElement, getStaticBasePath} = require('./helpers')
const {getWebpackConfig} = require('./webpack')

function getServer$(opts) {
  return Observable.create(observer => {
    const webpackConfig = getWebpackConfig({basePath: opts.basePath})
    const staticBasePath = getStaticBasePath(opts)
    const app = express()

    app.get(`${opts.staticPath}/css/main.css`, (req, res) => {
      res.set('Content-Type', 'text/css')
      res.send()
    })

    const compiler = webpack(webpackConfig)

    // "invalid" doesn't mean the bundle is invalid, but that it is *invalidated*,
    // in other words, it's recompiling
    compiler.plugin('invalid', () => {
      observer.next({type: 'webpack/invalid'})
    })

    // Start the server and try to create more user-friendly errors if we encounter issues
    // try {
    //   await promisify(server.listen.bind(server))(httpPort, httpHost)
    // } catch (err) {
    //   gracefulDeath(httpHost, config, err)
    // }

    // Hold off on showing the spinner until compilation has started
    compiler.plugin('compile', () => {
      observer.next({type: 'webpack/compile'})
    })

    // "done" event fires when Webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.plugin('done', stats => {
      const hasErrors = stats.hasErrors()
      const hasWarnings = stats.hasWarnings()

      if (!hasErrors && !hasWarnings) {
        observer.next({type: 'webpack/done_with_success'})
        return
      }

      if (hasErrors) {
        observer.next({
          type: 'webpack/done_with_errors',
          hasErrors,
          hasWarnings,
          stats: stats.toJson({}, true)
        })
      }
    })

    app.use(
      webpackDevMiddleware(compiler, {
        // logLevel: 'silent',
        watchOptions: {
          ignored: /node_modules/
        },
        publicPath: webpackConfig.output.publicPath
      })
    )

    app.use(webpackHotMiddleware(compiler))

    app.use(staticBasePath, express.static(opts.staticPath))

    app.get('*', (req, res) => {
      if (req.url.startsWith(staticBasePath)) {
        return res.status(404).send('File not found')
      }

      return getDocumentElement(opts)
        .then(doc => res.send(`<!doctype html>${ReactDOMServer.renderToStaticMarkup(doc)}`))
        .catch(err => {
          console.error(err.stack)

          res
            .set('Content-Type', 'text/plain')
            .status(500)
            .send(err.stack)
        })
    })

    app.listen(opts.httpPort, err => {
      if (err) {
        observer.error(err)
      } else {
        observer.next({type: 'server/listen', port: opts.httpPort})
      }
    })
  })
}

module.exports = {getServer$}
