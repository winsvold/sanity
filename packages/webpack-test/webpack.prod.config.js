/* eslint-disable import/no-commonjs, import/no-dynamic-require */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

const WEBPACK_LOADER_PATH = path.resolve('../@sanity/webpack-loader/src')
const {PartPlugin, PartResolverPlugin} = require(WEBPACK_LOADER_PATH)

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: ['normalize.css?raw', path.resolve(__dirname, './src/entry.js')],
    vendor: ['react', 'react-dom']
  },
  output: {
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
              {loader: MiniCssExtractPlugin.loader, options: {publicPath: '/static/'}},
              {loader: 'css-loader', options: {importLoaders: 1}}
            ]
          },
          {
            use: [
              {loader: 'style-loader'},
              {loader: MiniCssExtractPlugin.loader, options: {publicPath: '/static/'}},
              {
                loader: 'css-loader',
                options: {
                  modules: {localIdentName: '[name]_[local]_[hash:base64:5]'},
                  importLoaders: 1
                }
              },
              {loader: 'postcss-loader', options: {config: {path: __dirname}}}
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
  resolve: {
    plugins: [new PartResolverPlugin()]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|nb/),
    new PartPlugin({basePath: __dirname}),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    })
  ]
}
