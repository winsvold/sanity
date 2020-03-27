import getBaseConfig from './webpack.config'

export default config => {
  const baseConfig = getBaseConfig(Object.assign({}, config, {env: 'production'}))

  return Object.assign({}, baseConfig, {
    mode: 'production',
    devtool: config.sourceMaps ? 'source-map' : undefined,
    plugins: baseConfig.plugins || []
  })
}
