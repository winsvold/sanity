import webpack from 'webpack'
import registerBabel from '@babel/register'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {getBaseServer, applyStaticRoutes, callInitializers} from './baseServer'
import getWebpackDevConfig from './configs/webpack.config.dev'
import getStaticBasePath from './util/getStaticBasePath'

export default function getDevServer(config = {}) {
  const staticPath = getStaticBasePath(config)
  const basePath = getStaticBasePath.getBasePath(config)
  const app = getBaseServer(config)
  const webpackConfig = config.webpack || getWebpackDevConfig(config)

  console.log('basePath', basePath)

  // Serve an empty CSS file for the main stylesheet,
  // as they are injected dynamically in development mode
  app.get(`${staticPath}/css/main.css`, (req, res) => {
    res.set('Content-Type', 'text/css')
    res.send()
  })

  app.get(`${basePath}/__sanity_dev_server`, (req, res) => {
    res.set('Content-Type', 'text/event-stream')
    res.write('event: open\n\n')
  })

  // Use babel-register in order to be able to load things like
  // the document component, which can contain JSX etc
  registerBabel()

  // Apply the dev and hot middlewares to build/serve bundles on the fly
  const compiler = webpack(webpackConfig)
  app.use(
    webpackDevMiddleware(compiler, {
      logLevel: 'silent',
      watchOptions: {
        ignored: /node_modules/
      },
      publicPath: webpackConfig.output.publicPath
    })
  )

  app.use(webpackHotMiddleware(compiler))

  // Expose webpack compiler on server instance
  app.locals.compiler = compiler

  // Call any registered initializers
  callInitializers(config)

  return applyStaticRoutes(app, config)
}
