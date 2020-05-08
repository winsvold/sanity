import webpack from 'webpack'
import getBaseConfig from './webpack.config'

export default config => {
  const baseConfig = getBaseConfig(config)

  return {
    ...baseConfig,
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      pathinfo: true,
      ...baseConfig.output
    },
    entry: {
      ...baseConfig.entry,
      vendor: [
        require.resolve('eventsource-polyfill'),
        require.resolve('../browser/hot-client')
      ].concat(baseConfig.entry.vendor)
    },
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve.alias,
        'react-dom': require.resolve('@hot-loader/react-dom'),
        'webpack-hot-middleware/client': require.resolve('../browser/hot-client')
      }
    },
    plugins: (baseConfig.plugins || []).concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  }
}
