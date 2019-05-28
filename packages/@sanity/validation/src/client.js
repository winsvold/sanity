const sanityClient = require('part:@sanity/base/client')

module.exports = sanityClient.withConfig({apiVersion: '1'})
