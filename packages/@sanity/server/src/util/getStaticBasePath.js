/* eslint-disable no-process-env */

const getBasePath = config => {
  return (process.env.STUDIO_BASEPATH || (config.project && config.project.basePath) || '').replace(
    /\/+$/,
    ''
  )
}

const getStaticBasePath = config => {
  if (!process.env.STUDIO_BASEPATH && (!config.project || !config.project.basePath)) {
    return '/static'
  }
  return `${getBasePath(config)}/static`
}

module.exports = getStaticBasePath
module.exports.getBasePath = getBasePath
