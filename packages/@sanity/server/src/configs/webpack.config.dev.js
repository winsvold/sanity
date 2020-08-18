import path from 'path'
import glob from 'glob'
import webpack from 'webpack'
import applyStaticLoaderFix from '../util/applyStaticLoaderFix'
import getBaseConfig from './webpack.config'

const MONOREPO_PATH = path.resolve(__dirname, '../../../../..')

function getSanityAliases(config) {
  if (config.watchMode === 'monorepo') {
    // find package aliases
    const sanityPackagePaths = glob.sync(
      path.resolve(MONOREPO_PATH, 'packages/@sanity/*/package.json')
    )
    const sanityPackageAliases = sanityPackagePaths.reduce((acc, sanityPackagePath) => {
      const packagePath = path.dirname(sanityPackagePath)

      acc[`@sanity/${path.basename(packagePath)}/lib`] = path.join(packagePath, 'src')
      acc[`@sanity/${path.basename(packagePath)}`] = path.join(packagePath, 'src')

      return acc
    }, {})

    // find root aliases
    const sanityRootPaths = glob.sync(path.resolve(MONOREPO_PATH, 'packages/@sanity/*/*.js'))
    const sanityRootAliases = sanityRootPaths.reduce((acc, sanityPackagePath) => {
      const basename = path.basename(sanityPackagePath, '.js')
      const packagePath = path.dirname(sanityPackagePath)
      const name = path.basename(packagePath)

      acc[`@sanity/${name}/${basename}`] = sanityPackagePath

      return acc
    }, {})

    // custom aliases
    const sanityCustomAliasesBefore = {
      '@sanity/observable/operators': path.resolve(
        MONOREPO_PATH,
        'packages/@sanity/observable/operators'
      ),
      '@sanity/util/paths.js': path.resolve(MONOREPO_PATH, 'packages/@sanity/util/paths.js')
    }
    const sanityCustomAliasesAfter = {
      '@sanity/client': path.resolve(MONOREPO_PATH, 'packages/@sanity/client/src/sanityClient.js'),
      '@sanity/eventsource': path.resolve(MONOREPO_PATH, 'packages/@sanity/eventsource/browser.js'),
      '@sanity/generate-help-url': path.resolve(
        MONOREPO_PATH,
        'packages/@sanity/generate-help-url/index.js'
      ),
      '@sanity/uuid': path.resolve(MONOREPO_PATH, 'packages/@sanity/uuid/index.js'),
      '@sanity/observable': path.resolve(MONOREPO_PATH, 'packages/@sanity/observable/minimal.js'),
      '@sanity/preview': path.resolve(MONOREPO_PATH, 'packages/@sanity/preview/index.js'),
      '@sanity/schema': path.resolve(MONOREPO_PATH, 'packages/@sanity/schema/src/legacy')
    }

    return {
      ...sanityCustomAliasesBefore,
      ...sanityRootAliases,
      ...sanityPackageAliases,
      ...sanityCustomAliasesAfter
    }
  }

  return {}
}

export default config => {
  const baseConfig = getBaseConfig(config)
  const sanityAliases = getSanityAliases(config)

  console.log(sanityAliases)

  return Object.assign({}, baseConfig, {
    devtool: 'cheap-module-source-map',
    output: Object.assign({pathinfo: true}, baseConfig.output),
    entry: Object.assign({}, baseConfig.entry, {
      vendor: [
        require.resolve('eventsource-polyfill'),
        require.resolve('../browser/hot-client')
      ].concat(baseConfig.entry.vendor)
    }),
    resolve: {
      alias: Object.assign({}, baseConfig.resolve.alias, {
        'react-dom': require.resolve('@hot-loader/react-dom'),
        'webpack-hot-middleware/client': require.resolve('../browser/hot-client'),
        ...sanityAliases
      }),
      extensions: baseConfig.resolve.extensions
    },
    plugins: (baseConfig.plugins || []).concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]),
    module: Object.assign({}, baseConfig.module, {
      rules: applyStaticLoaderFix(baseConfig, config)
    })
  })
}
