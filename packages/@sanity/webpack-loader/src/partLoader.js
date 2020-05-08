const sanityUtil = require('@sanity/util')
const {getOptions, parseQuery} = require('loader-utils')
const path = require('path')
const multiImplementationHandler = require('./multiImplementationHandler')

const sanityEnv = process.env.SANITY_INTERNAL_ENV
const env = typeof sanityEnv === 'undefined' ? process.env.NODE_ENV : sanityEnv

module.exports = function partLoader(source, sourceMap) {
  this.cacheable()

  const options = getOptions(this)
  const query = this.resourceQuery ? parseQuery(this.resourceQuery) : {}
  const cache = this._compiler.__sanityCache
  const basePath = cache && cache.__basePath
  const parts = cache && cache.__parts

  // Return early if the "parts" have not been cached
  // or the query parameter is not present (i.e. this is not a "part")
  if (!parts || !query.sanityPart) return source

  let buildEnv = sanityEnv
  if (!buildEnv) {
    buildEnv = options.devtool ? env : 'production'
  }

  const partId = query.sanityPart
  const loadAll = partId.indexOf('all:') === 0
  const partName = loadAll ? partId.substr(4) : partId

  if (partId.indexOf('config:') === 0) {
    const config = JSON.parse(source)
    const indent = buildEnv === 'production' ? 0 : 2
    const reduced = sanityUtil.reduceConfig(config, buildEnv, {studioRootPath: basePath})
    return JSON.stringify(reduced, null, indent)
  }

  if (partId === 'sanity:versions') {
    const versions = sanityUtil.getSanityVersions(basePath)
    const indent = buildEnv === 'production' ? 0 : 2
    return `module.exports = ${JSON.stringify(versions, null, indent)}\n`
  }

  // Gather dependencies
  const dependencies = parts.plugins.map(plugin => path.join(plugin.path, 'sanity.json'))
  const implementations = (parts.implementations[partName] || []).map(impl => impl.path)

  // Add dependencies
  this.addDependency(path.join(basePath, 'sanity.json'))
  dependencies.forEach(this.addDependency)

  // The debug role needs to return the whole parts tree
  if (partName === 'sanity:debug') {
    const debug = Object.assign({}, parts, {basePath})
    return `module.exports = ${JSON.stringify(debug, null, 2)}\n`
  }

  const ret = loadAll ? multiImplementationHandler(partName, implementations) : source

  if (typeof ret !== 'string') {
    throw new Error('must be a string')
  }

  return ret
}
