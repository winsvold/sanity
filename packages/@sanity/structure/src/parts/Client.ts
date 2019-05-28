import getDefaultModule from './getDefaultModule'

interface StudioClient {
  withConfig(config: {apiVersion: string}): SanityClient
}

interface SanityClient {
  fetch(query: string, params: {[key: string]: any}): Promise<any>
}

// We are lazy-loading the part to work around typescript trying to resolve it
const client = ((): SanityClient => {
  const client: StudioClient = getDefaultModule(require('part:@sanity/base/client'))
  return client.withConfig({apiVersion: '1'})
})()

export {client}
