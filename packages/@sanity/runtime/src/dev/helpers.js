'use strict'

/* eslint-disable no-process-env */

const React = require('react')
const requireUncached = require('require-uncached')
const {resolveParts} = require('../manifest')
const {getImplementationPath} = require('../util/implementationPath')

const DOC_PART = 'part:@sanity/base/document'

function getTitle(project = {}) {
  const projectName = project && project.name

  return projectName ? `${projectName} – Sanity` : 'Sanity'
}

function assetify(assetPath, hashes) {
  return {path: assetPath, hash: hashes[assetPath]}
}

function getDefaultModule(mod) {
  return mod && mod.__esModule ? mod.default : mod
}

function getStaticBasePath(opts) {
  if (!process.env.STUDIO_BASEPATH && (!opts.project || !opts.project.basePath)) {
    return '/static'
  }

  const basePath = (
    process.env.STUDIO_BASEPATH ||
    (opts.project && opts.project.basePath) ||
    ''
  ).replace(/\/+$/, '')

  return `${basePath}/static`
}

async function getDocumentComponent(basePath) {
  const parts = await resolveParts({basePath})
  const part = parts.impl[DOC_PART]

  if (!part) {
    throw new Error(
      `Part '${DOC_PART}' is not implemented by any plugins, are you missing @sanity/base?`
    )
  }

  return getDefaultModule(requireUncached(getImplementationPath(part[0])))
}

function getDocumentElement({project, basePath, hashes}, props = {}) {
  const assetHashes = hashes || {}

  // Project filesystem base path
  return getDocumentComponent(basePath).then(component =>
    React.createElement(component, {
      // URL base path
      basePath: process.env.STUDIO_BASEPATH || (project && project.basePath) || '',
      title: getTitle(project),
      stylesheets: ['css/main.css'].map(item => assetify(item, assetHashes)),
      scripts: ['js/vendor.bundle.js', 'js/app.bundle.js'].map(item => assetify(item, assetHashes)),
      ...props
    })
  )
}

module.exports = {getDocumentElement, getStaticBasePath}
