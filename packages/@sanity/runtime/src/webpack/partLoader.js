'use strict'

/* eslint-disable no-process-env */

const sanityUtil = require('@sanity/util')
// const path = require('path')
const loaderUtils = require('loader-utils')
const {getImplementationPath} = require('../util/implementationPath')
const {multiImplementationHandler} = require('./multiImplementationHandler')

const reduceConfig = sanityUtil.reduceConfig
const getSanityVersions = sanityUtil.getSanityVersions

const sanityEnv = process.env.SANITY_INTERNAL_ENV
const env = typeof sanityEnv === 'undefined' ? process.env.NODE_ENV : sanityEnv

// eslint-disable-next-line complexity
function partLoader(input) {
  this.cacheable()

  let buildEnv = sanityEnv
  if (!buildEnv) {
    buildEnv = this.options.devtool ? env : 'production'
  }

  const qs = this.resourceQuery.substring(this.resourceQuery.indexOf('?'))
  const request = (loaderUtils.parseQuery(qs) || {}).sanityPart

  const loadAll = request.indexOf('all:') === 0
  const partName = loadAll ? request.substr(4) : request

  // In certain cases (CSS when building statically),
  // a separate compiler instance is triggered
  if (!this._compiler.sanity) {
    return input
  }

  const basePath = this._compiler.sanity.basePath
  const parts = this._compiler.sanity.parts

  if (request.indexOf('config:') === 0) {
    const config = JSON.parse(input)
    const indent = buildEnv === 'production' ? 0 : 2
    const reduced = reduceConfig(config, buildEnv, {studioRootPath: basePath})
    return `module.exports = ${JSON.stringify(reduced, null, indent)}\n`
  }

  if (request === 'sanity:versions') {
    const versions = getSanityVersions(basePath)
    const indent = buildEnv === 'production' ? 0 : 2
    return `module.exports = ${JSON.stringify(versions, null, indent)}\n`
  }

  // @todo: Is this the right place to add dependencies???
  // const dependencies = parts.plugins.map(plugin => )
  // this.addDependency(path.join(basePath, 'sanity.json'))
  // parts.plugins.forEach(dep => {
  //   this.addDependency(path.join(plugin.path, 'sanity.json'))
  // })

  // The debug role needs to return the whole parts tree
  if (partName === 'sanity:debug') {
    return `module.exports = ${JSON.stringify({basePath, ...parts}, null, 2)}\n`
  }

  if (loadAll) {
    const implementations = (parts.impl[partName] || []).map(getImplementationPath)

    return multiImplementationHandler(partName, implementations)
  }

  return input
}

module.exports = partLoader
