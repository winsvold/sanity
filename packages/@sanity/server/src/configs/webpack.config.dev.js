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

    return {...sanityRootAliases, ...sanityPackageAliases}
  }

  return {}
}

export default config => {
  const baseConfig = getBaseConfig(config)
  const sanityAliases = getSanityAliases(config)

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
