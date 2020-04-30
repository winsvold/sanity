export const postType = {
  type: 'document',
  name: 'post',
  fields: [
    {type: 'array', of: [{type: 'block'}], name: 'body', title: 'Body'},
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'array', name: 'authors', title: 'Authors'},
    {type: 'boolean', name: 'isPublished', title: 'Is published'},
    {type: 'color', name: 'color', title: 'Color'},
    {type: 'date', name: 'publishedAt', title: 'Published at'},
    {
      type: 'object',
      name: 'seo',
      title: 'SEO',
      fields: [{type: 'string', name: 'title', title: 'Title'}]
    }
  ]
}
