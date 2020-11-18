// eslint-disable-next-line strict
'use strict'

const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PACKAGES_PATH = path.resolve(__dirname, '../../packages')

module.exports = {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    hot: true,
    historyApiFallback: true,
  },
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', './src/main.hot.tsx'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        include: [__dirname, path.resolve(PACKAGES_PATH, '@sanity/base/src')],
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.build.json'),
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@popperjs/core': require.resolve('@popperjs/core'),
      '@sanity/base': path.resolve(PACKAGES_PATH, '@sanity/base/src'),
      react: require.resolve('react'),
      'react-dom': require.resolve('@hot-loader/react-dom'),
      'react-popper': require.resolve('react-popper'),
      'react-refractor': require.resolve('react-refractor'),
      'styled-components': require.resolve('styled-components'),
    },
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({template: path.join(__dirname, 'src/template.html')}),
  ],
}
