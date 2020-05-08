const resolveProjectRoot = require('@sanity/resolver').resolveProjectRoot
const webpackIntegration = require('@sanity/webpack-integration/v4')

const plugins = webpackIntegration.getPostcssPlugins({
  basePath: resolveProjectRoot({sync: true})
})

module.exports = {plugins}
