import lazyRequire from '@sanity/util/lib/lazyRequire'

const helpText = `
Notes
  Changing the hostname or port number might require a new CORS-entry to be added.

Options
  --port <port> TCP port to dev server on. [default: 3333]
  --host <host> The local network interface at which to listen. [default: "localhost"]

Examples
  sanity dev --host=0.0.0.0
  sanity dev --port=1942
`

export default {
  name: 'dev',
  signature: '[--port <port>] [--host <host>]',
  description: 'Starts a development web server for the Sanity Studio',
  action: lazyRequire(require.resolve('../../actions/dev/devAction')),
  helpText
}
