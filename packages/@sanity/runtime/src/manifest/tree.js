'use strict'

const findConfig = require('find-config')
const fs = require('fs')
const path = require('path')
const util = require('util')
const {readManifest} = require('./manifest')

const realpath = util.promisify(fs.realpath)
const resolve = util.promisify(require('resolve'))

function resolvePluginMainPath(name, params) {
  if (name.startsWith('.') || name.startsWith('@sanity/')) {
    return resolve(name, {basedir: params.basePath})
  }

  return resolve(`sanity-plugin-${name}`, {basedir: params.basePath})
}

async function resolvePlugin(name, params) {
  const mainPath = await resolvePluginMainPath(name, params)
  const manifestPath = findConfig('sanity.json', {cwd: path.dirname(mainPath)})
  const pluginPath = path.dirname(manifestPath)
  const basePath = await realpath(pluginPath)

  return resolveTree({basePath, name})
}

async function resolveTree(params) {
  const rootManifest = await readManifest({basePath: params.basePath})
  const pluginNames = rootManifest.plugins || []
  const plugins = await Promise.all(
    pluginNames.map(pluginName => resolvePlugin(pluginName, params))
  )

  return {
    path: params.basePath,
    name: params.name || null,
    manifest: rootManifest,
    plugins
  }
}

module.exports = {resolveTree}
