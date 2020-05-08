/* eslint-disable class-methods-use-this */

const qs = require('qs')
const path = require('path')

const EMPTY_PART_PATH = require.resolve('./parts/empty')
const DEBUG_PART_PATH = require.resolve('./parts/debug')
const UNIMPLEMENTED_PART_PATH = require.resolve('./parts/unimplemented')

const PART_MODULE_ID_RE = /^(all:)?part:[@A-Za-z0-9_-]+\/[A-Za-z0-9_/-]+/
const CONFIG_MODULE_ID_RE = /^config:(@?[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+|[A-Za-z0-9_-]+)$/
const SANITY_CORE_MODULE_ID_RE = /^sanity:/

function isPartModule(moduleId) {
  return PART_MODULE_ID_RE.exec(moduleId)
}

function isConfigModule(moduleId) {
  return CONFIG_MODULE_ID_RE.exec(moduleId)
}

function isSanityCoreModule(moduleId) {
  return SANITY_CORE_MODULE_ID_RE.exec(moduleId)
}

function isSanityModule(moduleId) {
  moduleId.startsWith('part:')

  return isPartModule(moduleId) || isConfigModule(moduleId) || isSanityCoreModule(moduleId)
}

function getResolveOptions(options) {
  const reqQuery = (options.request.query || '').replace(/^\?/, '')
  const query = {...(qs.parse(reqQuery) || {}), sanityPart: options.request.request}

  return {...options.request, request: options.resolveTo, query: `?${qs.stringify(query)}`}
}

class PartResolverPlugin {
  constructor(options) {
    this.cache = options.cache
  }

  apply(resolver) {
    const cache = this.cache
    const target = resolver.ensureHook('resolve')
    const basePath = cache.__basePath
    const configPath = cache.__configPath
    const parts = cache.__parts

    resolver
      .getHook('described-resolve')
      .tapAsync('PartResolverPlugin', (request, resolveContext, callback) => {
        let moduleId = request.request

        if (moduleId.startsWith('./part:')) {
          moduleId = moduleId.substr(2)
        }

        if (!isSanityModule(moduleId)) {
          callback()
          return
        }

        const partName = moduleId.replace(/^all:/, '')

        // The debug part should return the whole part/plugin tree
        if (moduleId === 'sanity:debug') {
          resolver.doResolve(
            target,
            getResolveOptions({
              resolveTo: DEBUG_PART_PATH,
              request: request
            }),
            null,
            resolveContext,
            callback
          )
          return
        }

        // The versions part should return a list of module versions
        if (moduleId === 'sanity:versions') {
          resolver.doResolve(
            target,
            getResolveOptions({
              resolveTo: DEBUG_PART_PATH,
              request: request
            }),
            null,
            resolveContext,
            callback
          )
          return
        }

        // Configuration files resolve to a specific path
        // Either the root sanity.json or a plugins JSON config
        const configMatch = moduleId.match(CONFIG_MODULE_ID_RE)

        if (configMatch) {
          const configFor = configMatch[1]
          const req = {
            ...request,
            request:
              configFor === 'sanity'
                ? path.join(basePath, 'sanity.json')
                : path.join(configPath, `${configFor}.json`)
          }

          req.query = `?${qs.stringify({sanityPart: moduleId})}`
          resolver.doResolve(target, req, null, resolveContext, callback)
          return
        }

        const loadAll = request.request.indexOf('all:') === 0
        const allowUnimplemented = request.query === '?'
        const part = parts.implementations[partName]

        // Imports throw if they are not implemented, except if they
        // are prefixed with `all:` (returns an empty array) or they
        // are postfixed with `?` (returns undefined)
        if (!part) {
          if (allowUnimplemented) {
            resolver.doResolve(
              target,
              {request: UNIMPLEMENTED_PART_PATH, path: UNIMPLEMENTED_PART_PATH},
              null,
              resolveContext,
              callback
            )
            return
          }

          if (loadAll) {
            resolver.doResolve(
              target,
              {request: EMPTY_PART_PATH, path: EMPTY_PART_PATH},
              null,
              resolveContext,
              callback
            )
            return
          }

          callback(new Error(`Part "${partName}" not implemented by any plugins`))
          return
        }

        const resolveOpts = getResolveOptions({
          resolveTo: part[0].path,
          request: request
        })

        resolver.doResolve(target, resolveOpts, null, resolveContext, callback)
      })
  }
}

module.exports = PartResolverPlugin
