import client from 'part:@sanity/base/client'
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const apiClient = client.withConfig({apiVersion: '1'})

const configuredClient = sanityClient({
  projectId: '3do82whm',
  dataset: 'production',
  useCdn: true
})

export default {
  getFeed: templateRepoId => {
    const uri = templateRepoId
      ? `/addons/dashboard?templateRepoId=${templateRepoId}`
      : '/addons/dashboard'
    return apiClient.request({uri, withCredentials: false})
  },
  urlBuilder: imageUrlBuilder(configuredClient)
}
