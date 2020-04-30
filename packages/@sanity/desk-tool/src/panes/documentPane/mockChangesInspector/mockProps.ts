export const documentDiff = {
  type: 'document',
  fields: {
    // block array
    body: {
      type: 'array',
      diff: {
        fromValue: [{type: 'paragraph', children: [{text: 'test'}]}],
        toValue: [{type: 'paragraph', children: []}],
        actions: [
          {
            type: 'update',
            path: [0, 'children', 0, 'text'],
            select: [0, 3],
            text: 'foo',
            userId: 'km'
          }
        ]
      }
    },

    title: {
      type: 'string',
      diff: {
        fromValue: 'Sanity seems cool!',
        toValue: 'Sanity is awesome! We need to use it immediately.',
        segments: [
          {type: 'ignore', text: 'Sanity '},
          {type: 'remove', text: 'seems cool!', userId: 'eh'},
          {type: 'add', text: 'is awesome!', userId: 'eh'},
          {
            type: 'add',
            text: ' We need to use it immediately.',
            change: {operation: 'add', author: 'km'}
          }
        ]
      }
    },

    authors: {
      type: 'array',
      diff: {
        fromValue: [{_ref: 'ew'}, {_ref: 'km'}],
        toValue: [{_ref: 'km'}, {_ref: 'eh'}],
        actions: [
          {type: 'move', fromIndex: 1, toIndex: 0, value: {_ref: 'km'}, userId: 'ew'},
          {type: 'insert', index: 1, value: {_ref: 'eh'}, userId: 'km'},
          {type: 'remove', index: 2, value: {_ref: 'ew'}, userId: 'eh'}
        ]
      }
    },

    isPublished: {
      type: 'boolean',
      diff: {
        fromValue: true,
        toValue: false,
        actions: [{type: 'set', value: false, userId: 'km'}]
      }
    },

    color: {
      type: 'color',
      diff: {
        fromValue: undefined,
        toValue: '#f00',
        actions: [{type: 'set', value: '#f00', userId: 'km'}]
      }
    },

    publishedAt: {
      type: 'datetime',
      diff: {
        fromValue: undefined,
        toValue: '2020-01-05',
        actions: [{type: 'set', value: '2020-01-05', userId: 'km'}]
      }
    },

    seo: {
      type: 'object',
      diff: {
        fields: {
          title: {
            type: 'string',
            diff: {
              fromValue: 'Sanity seems cool!',
              toValue: 'Sanity is awesome! We need to use it immediately.',
              segments: [
                {type: 'ignore', text: 'Sanity '},
                {type: 'remove', text: 'seems cool!', userId: 'eh'},
                {type: 'add', text: 'is awesome!', userId: 'eh'},
                {
                  type: 'add',
                  text: ' We need to use it immediately.',
                  change: {operation: 'add', author: 'km'}
                }
              ]
            }
          }
        }
      }
    }
  }
}
