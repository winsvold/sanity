export default {
  name: 'person',
  type: 'document',
  title: 'Person',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Full name'
    },
    {
      name: 'photo',
      type: 'figure',
      title: 'Photo'
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    },
    {
      name: 'contactInfo',
      type: 'contaccontactInfo',
      title: 'Contact information'
    }
  ]
}
