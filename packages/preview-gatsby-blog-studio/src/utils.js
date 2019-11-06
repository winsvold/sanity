/* eslint-disable import/prefer-default-export */
const defaultBehaviors = {nonTextBehavior: 'remove'}

export const websiteUrl = 'https://preview-gatsby-blog.netlify.com'

export function assemblePostUrl(doc) {
  const [year, month] = doc.publishedAt.split('T')[0].split('-')
  return `${websiteUrl}/blog/${year}/${month}/${doc.slug.current}`
}

export function blocksToText(blocks, opts = {}) {
  const options = Object.assign({}, defaultBehaviors, opts)
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
      }

      return block.children.map(child => child.text).join('')
    })
    .join('\n\n')
}
