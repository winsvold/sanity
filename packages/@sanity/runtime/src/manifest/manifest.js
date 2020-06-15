'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const readFile = util.promisify(fs.readFile)

async function readManifestAsync(params) {
  // console.log('readManifest', params)

  const buf = await readFile(path.resolve(params.basePath, 'sanity.json'))

  const manifest = JSON.parse(buf.toString())

  // @todo: extend with `env` parameter

  return manifest
}

function readManifestSync(params) {
  // console.log('readManifest', params)

  const buf = fs.readFileSync(path.resolve(params.basePath, 'sanity.json'))

  const manifest = JSON.parse(buf.toString())

  // @todo: extend with `env` parameter

  return manifest
}

function readManifest(params) {
  if (params.sync) {
    return readManifestSync(params)
  }

  return readManifestAsync(params)
}

module.exports = {readManifest}
