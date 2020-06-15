'use strict'

/* eslint-disable no-process-env */

const {getEnvPlugin, getPartLoader, getPartResolverPlugin} = require('../webpack')
const fs = require('fs')
const path = require('path')
const resolveFrom = require('resolve-from')
const rxPaths = require('rxjs/_esm5/path-mapping')
const webpack = require('webpack')

function tryRead(filePath) {
  try {
    // eslint-disable-next-line no-sync
    const content = fs.readFileSync(filePath)
    return JSON.parse(content)
  } catch (err) {
    return null
  }
}

const getStaticBasePath = config => {
  if (!process.env.STUDIO_BASEPATH && (!config.project || !config.project.basePath)) {
    return '/static'
  }

  const basePath = (
    process.env.STUDIO_BASEPATH ||
    (config.project && config.project.basePath) ||
    ''
  ).replace(/\/+$/, '')

  return `${basePath}/static`
}

// eslint-disable-next-line complexity
function getWebpackConfig(params) {
  const staticPath = getStaticBasePath(params)
  const wpIntegrationOptions = {basePath: params.basePath, env: params.env, webpack}
  const basePath = params.basePath || process.cwd()
  const skipMinify = params.skipMinify || false
  const reactPath = resolveFrom.silent(basePath, 'react')
  const reactDomPath = resolveFrom.silent(basePath, 'react-dom')
  const missing = [!reactPath && '`react`', !reactDomPath && '`react-dom`'].filter(Boolean)
  if (!reactPath || !reactDomPath) {
    const missingErr = [
      `Could not find ${missing.join(', ')} dependencies in project directory`,
      'These need to be declared in `package.json` and be installed for Sanity to work'
    ].join('\n')

    throw new Error(missingErr)
  }

  const babelConfig = tryRead(path.join(basePath, '.babelrc'))

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      config: {
        path: path.join(__dirname, 'postcss.config.js')
      }
    }
  }

  const cssLoaderLocation = require.resolve('@sanity/css-loader')
  const baseCssLoader = `${cssLoaderLocation}?modules&localIdentName=[name]_[local]_[hash:base64:5]&importLoaders=1`
  const cssLoader = skipMinify ? `${baseCssLoader}&sourceMap` : `${baseCssLoader}&minimize`

  const commonChunkPlugin =
    (typeof params.commonChunkPlugin === 'undefined' || params.commonChunkPlugin) &&
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'js/vendor.bundle.js'})

  return {
    devtool: 'cheap-module-source-map',
    entry: {
      app: [
        require.resolve('normalize.css'),
        path.join(__dirname, '..', 'browser', 'entry-dev.js')
      ],
      vendor: [
        require.resolve('eventsource-polyfill'),
        require.resolve('../browser/hot-client'),
        'react',
        'react-dom'
      ]
    },
    output: {
      pathinfo: true,
      path: params.outputPath || path.join(__dirname, '..', '..', 'dist'),
      filename: 'js/[name].bundle.js',
      publicPath: `${staticPath}/`
    },
    resolve: {
      alias: {
        moment$: 'moment/moment.js',
        react: path.dirname(reactPath),
        'react-dom': require.resolve('@hot-loader/react-dom'),
        ...rxPaths(),
        'webpack-hot-middleware/client': require.resolve('../browser/hot-client')
      },
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']
    },

    module: {
      rules: [
        {
          test: /(\.jsx?|\.tsx?)/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: babelConfig || {
              presets: [
                require.resolve('@babel/preset-typescript'),
                require.resolve('@babel/preset-react'),
                [
                  require.resolve('@babel/preset-env'),
                  {
                    targets: {
                      node: '8',
                      chrome: '59',
                      safari: '10',
                      firefox: '56',
                      edge: '14'
                    },
                    modules: 'commonjs'
                  }
                ]
              ],
              plugins: [require.resolve('@babel/plugin-proposal-class-properties')],
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.css(\?|$)/,
          oneOf: [
            {
              resourceQuery: /raw/, // foo.css?raw
              use: [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('@sanity/css-loader'),
                  options: {
                    importLoaders: 1
                  }
                }
              ]
            },
            {
              use: [require.resolve('style-loader'), cssLoader, postcssLoader]
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp|woff|woff2|ttf|eot|otf)$/,
          use: {
            loader: require.resolve('file-loader'),
            options: {name: 'assets/[name]-[hash].[ext]'}
          }
        },
        getPartLoader(wpIntegrationOptions)
      ]
    },
    plugins: [
      getEnvPlugin(wpIntegrationOptions),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|nb/),
      getPartResolverPlugin(wpIntegrationOptions),
      commonChunkPlugin,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    profile: params.profile || false
  }
}

module.exports = {getWebpackConfig}
