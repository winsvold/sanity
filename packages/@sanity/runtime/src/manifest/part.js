'use strict'

const generateHelpUrl = require('@sanity/generate-help-url')
const path = require('path')
const {resolveTree} = require('./tree')

function getPluginNodes(node) {
  if (!node || !Array.isArray(node.plugins)) return []

  return node.plugins.reduce((acc, plugin) => [plugin, ...getPluginNodes(plugin), ...acc], [])
}

function getDefinitionDeclaration(plugin, part, params = {}) {
  return {
    plugin: plugin.name,
    path: plugin.path,
    description: part.description,
    isAbstract:
      typeof params.isAbstract === 'undefined'
        ? typeof part.path === 'undefined'
        : params.isAbstract,
    loose: params.loose
  }
}

function getImplementationDeclaration(plugin, part, params) {
  const paths = plugin.manifest.paths || {}
  const isLib =
    params.useCompiledPaths || plugin.path.split(path.sep).indexOf('node_modules') !== -1
  const isDotPath = /^\.{1,2}[\\/]/.test(part.path)

  const sourceBasePath = isDotPath ? plugin.path : path.join(plugin.path, paths.source || '')
  const compiledBasePath = isDotPath ? plugin.path : path.join(plugin.path, paths.compiled || '')

  const sourceFilePath = path.isAbsolute(part.path)
    ? part.path
    : path.resolve(path.join(sourceBasePath, part.path))

  const compiledFilePath = path.isAbsolute(part.path)
    ? part.path
    : path.resolve(path.join(compiledBasePath, part.path))

  return {
    plugin: plugin.name,
    source: sourceFilePath,
    compiled: compiledFilePath,
    isLib
  }
}

function dedupePlugins(plugins) {
  const paths = []
  const result = []

  for (const plugin of plugins) {
    if (!paths.includes(plugin.path)) {
      result.push(plugin)
      paths.push(plugin.path)
    }
  }

  return result
}

function registerNonOverridablePartDefinition(result, plugin, part, params) {
  const prevDefinition = result.defs[part.name]

  if (prevDefinition) {
    // The part definition already exists, non-overridable parts can't be redefined
    const existing = `"${prevDefinition.plugin}" (${prevDefinition.path})`
    const current = `"${plugin.name}" (${plugin.path})`

    throw new Error(
      `${`Plugins ${existing} and ${current} both define part "${part.name}"` +
        ' - did you mean to use "implements"?\n' +
        'See '}${generateHelpUrl('part-declare-vs-implement')}`
    )
  }

  result.defs[part.name] = getDefinitionDeclaration(plugin, part)
  result.impl[part.name] = [getImplementationDeclaration(plugin, part, params)]
}

function registerPartDefinition(result, plugin, part) {
  const prevDefinition = result.defs[part.name]

  if (prevDefinition && !prevDefinition.loose) {
    // The part definition already exists, non-overridable parts can't be redefined
    const existing = `"${prevDefinition.plugin}" (${prevDefinition.path})`
    const current = `"${plugin.name}" (${plugin.path})`
    throw new Error(
      `${`Plugins ${existing} and ${current} both define part "${part.name}"` +
        ' - did you mean to use "implements"?\n' +
        'See '}${generateHelpUrl('part-declare-vs-implement')}`
    )
  }

  result.defs[part.name] = getDefinitionDeclaration(plugin, part)
}

function registerPartImplementation(result, plugin, part, params) {
  const partName = part.implements

  if (!part.path) {
    const current = `"${plugin.name}" (${plugin.path})`

    throw new Error(
      `${`Plugin ${current} tries to implement a part "${partName}",` +
        ' but did not define a path. Did you mean to use "name"?\n' +
        'See '}${generateHelpUrl('part-declare-vs-implement')}`
    )
  }

  const prevDefinition = result.defs[partName]

  if (prevDefinition && !prevDefinition.isAbstract) {
    const existing = `"${prevDefinition.plugin}" (${prevDefinition.path})`
    const current = `"${plugin.name}" (${plugin.path})`

    throw new Error(
      `${`Plugin ${current} tried to implement part "${partName}", which is already declared` +
        ` as a non-overridable part by ${existing} - ` +
        'See '}${generateHelpUrl('implement-non-overridable-part')}`
    )
  } else if (!prevDefinition) {
    // In some cases, a user might want to declare a new part name and
    // assign it a non-overridable implementation, while simulatenously
    // fulfilling an existing part using `implements`. In this case,
    // `name`, `implements` and `path` are all set, and we want the part
    // referenced in `implements` to be treated as a non-abstract part.
    // This is why we're explicitly setting `isAbstract` to true below
    // `loose` means that this declaration is "implicit" - the part isn't
    // defined as a `name` + `description` combination, so if we come across
    // a plugin that declares the part outright, we want to use that over this
    result.defs[partName] = getDefinitionDeclaration(plugin, part, {
      isAbstract: true,
      loose: true
    })
  }

  if (!result.impl[partName]) {
    result.impl[partName] = []
  }

  result.impl[partName].push(getImplementationDeclaration(plugin, part, params))
}

async function resolveParts(params) {
  const node = await resolveTree(params)
  const pluginNodes = dedupePlugins([node, ...getPluginNodes(node)])

  const result = {
    defs: {},
    impl: {},
    plugins: []
  }

  pluginNodes.forEach(plugin => {
    const parts = plugin.manifest.parts || []

    // register plugin
    result.plugins.push({name: plugin.name, path: plugin.path})

    // register parts
    parts.forEach(part => {
      if (part.name && part.path) {
        registerNonOverridablePartDefinition(result, plugin, part, params)
      } else if (part.name) {
        registerPartDefinition(result, plugin, part)
      }

      if (part.implements) {
        registerPartImplementation(result, plugin, part, params)
      }
    })
  })

  return result
}

module.exports = {resolveParts}
