'use strict'

/* eslint-disable no-sync */

const path = require('path')
const {readManifest} = require('./manifest')

function resolveProjectRootAsync(options) {
  // @todo implement actual async version
  return Promise.resolve(resolveProjectRootSync(options))
}

function resolveProjectRootSync(options) {
  let manifestDir = options.basePath
  let isProjectRoot = isRoot(manifestDir, options)

  while (!isProjectRoot && path.dirname(manifestDir) !== manifestDir) {
    manifestDir = path.dirname(manifestDir)
    isProjectRoot = isRoot(manifestDir, options)
  }

  if (isProjectRoot) {
    return manifestDir
  }

  throw new Error('root sanity.json not found')
}

function isRoot(manifestDir, options) {
  try {
    const manifest = readManifest({...options, manifestDir, sync: true})

    return manifest.root || false
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }

    // On any error that is not "file not found", rethrow
    throw err
  }
}

function resolveProjectRoot(opts = {}) {
  const options = {basePath: process.cwd(), ...opts}

  return options.sync ? resolveProjectRootSync(options) : resolveProjectRootAsync(options)
}

module.exports = {resolveProjectRoot}
