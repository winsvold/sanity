'use strict'

function getImplementationPath(impl) {
  if (impl.isLib) return impl.compiled

  // If the file is located outside of `node_modules`, then assume the source file is buildable
  return impl.source
}

module.exports = {getImplementationPath}
