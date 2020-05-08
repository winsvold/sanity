import webpack from 'webpack'
import getBaseConfig from './webpack.config'

export default config => {
  const baseConfig = getBaseConfig({...config, env: 'production'})

  return {
    ...baseConfig,
    mode: 'production',
    devtool: config.sourceMaps ? 'source-map' : undefined,
    plugins: (baseConfig.plugins || []).concat(
      [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ].filter(Boolean)
    )
  }
}
