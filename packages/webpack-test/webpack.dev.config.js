/* eslint-disable import/no-commonjs, import/no-dynamic-require */

const path = require('path')
const webpack = require('webpack')

const WEBPACK_LOADER_PATH = path.resolve('../@sanity/webpack-loader/src')
const {PartPlugin, PartResolverPlugin} = require(WEBPACK_LOADER_PATH)

const hotMiddlewareAnsiColors = {red: '00FF00'}
const hotMiddlewareOverlayStyles = {color: '#FF0000'}
const hotMiddlewareScript = [
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&ansiColors=',
  encodeURIComponent(JSON.stringify(hotMiddlewareAnsiColors)),
  '&overlayStyles=',
  encodeURIComponent(JSON.stringify(hotMiddlewareOverlayStyles))
].join('')

const partsCache = {}

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    app: [hotMiddlewareScript, 'normalize.css?raw', path.resolve(__dirname, './src/entry-dev.js')],
    vendor: ['react', 'react-dom']
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/static/'
  },
  module: {
    rules: [
      {
        test: /(\.jsx?|\.mjs|\.tsx?)$/,
        exclude: /(packages\/@sanity|node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css(\?|$)/,
        oneOf: [
          {
            resourceQuery: /raw/,
            use: [
              {loader: 'style-loader'},
              {loader: 'css-loader', options: {importLoaders: 1, sourceMap: true}}
            ]
          },
          {
            use: [
              {loader: 'style-loader'},
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {localIdentName: '[name]_[local]_[hash:base64:5]'}
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: __dirname
                  }
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp|woff|woff2|ttf|eot|otf)$/,
        use: {loader: 'file-loader', options: {name: 'assets/[name]-[hash].[ext]'}}
      },
      {
        use: {loader: path.resolve(WEBPACK_LOADER_PATH, './partLoader.js')},
        resourceQuery: /[?&]sanityPart=/
      }
    ]
  },
  profile: false,
  resolve: {
    alias: {
      'react-dom': require.resolve('@hot-loader/react-dom')
    },
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
    plugins: [new PartResolverPlugin({cache: partsCache})]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|nb/),
    new PartPlugin({basePath: __dirname, cache: partsCache}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
