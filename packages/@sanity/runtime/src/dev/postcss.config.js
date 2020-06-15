'use strict'

const {resolveProjectRoot} = require('../manifest')
const {getPostcssPlugins} = require('../postcss')

module.exports = {
  plugins: getPostcssPlugins({
    basePath: resolveProjectRoot({sync: true}),
    cssnext: {
      features: {
        customProperties: true
      }
    }
  })
}
