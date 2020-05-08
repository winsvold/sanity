/* eslint-disable import/no-commonjs */

const webpackIntegration = require('../@sanity/webpack-integration/v4')

const plugins = webpackIntegration.getPostcssPlugins({basePath: __dirname})

module.exports = {plugins}
