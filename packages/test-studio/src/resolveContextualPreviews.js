const PREVIEW_TYPES = ['book', 'author']
const PREVIEWS = [
  {
    name: 'example-com',
    title: 'Example.com',
    url: 'https://example.com/posts'
  },
  {
    name: 'old-blog',
    title: 'Old Blog',
    url: 'https://my-old-blog.com'
  }
]

export default function resolveContextualPreviews(document, rev) {
  if (!PREVIEW_TYPES.includes(document._type)) {
    return null
  }

  return PREVIEWS.map(item => {
    const url = `${item.url}/${document._id}`
    return {...item, url: rev ? `${url}?rev=${rev}` : url}
  })
}
