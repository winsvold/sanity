/* eslint-disable import/prefer-default-export */
export function assemblePostUrl(document) {
  const [year, month] = document.publishedAt.split('T')[0].split('-')
  return `blog/${year}/${month}/${document.slug.current}`
}
