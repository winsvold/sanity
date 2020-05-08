const partResolver = require('@sanity/resolver')
const path = require('path')

class PartPlugin {
  constructor(options) {
    if (!options || !options.basePath) {
      throw new Error('`basePath` option must be specified in part resolver plugin constructor')
    }

    this.cache = options.cache
    this.env = options.env
    this.basePath = options.basePath
    this.additionalPlugins = options.additionalPlugins || []
    this.configPath = path.join(this.basePath, 'config')
  }

  apply(compiler) {
    const cache = this.cache
    const env = this.env
    const basePath = this.basePath
    const configPath = this.configPath
    const additionalPlugins = this.additionalPlugins

    compiler.__sanityCache = cache

    const runHook = (currentCompiler, callback) => {
      partResolver
        .resolveParts({env, basePath, additionalPlugins})
        .then(parts => {
          cache.__basePath = basePath
          cache.__configPath = configPath
          cache.__parts = parts
          callback()
        })
        .catch(callback)
    }

    compiler.hooks.run.tapAsync('PartPlugin', runHook)
    compiler.hooks.watchRun.tapAsync('PartPlugin', runHook)
  }
}

module.exports = PartPlugin
