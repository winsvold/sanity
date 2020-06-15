'use strict'

const postcssImport = require('postcss-import')
const postcssCssnext = require('postcss-cssnext')
const {resolveStyleImport} = require('./styleImport')

function getPostcssPlugins(options) {
  return [
    postcssImport({resolve: resolveStyleImport({from: options.basePath})}),
    postcssCssnext(options.cssnext)
  ]
}

module.exports = {getPostcssPlugins}
