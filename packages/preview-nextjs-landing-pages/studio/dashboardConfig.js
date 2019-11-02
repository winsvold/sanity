export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-nextjs-landing-pages'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '5dbd42c27c00cd899586f7ed',
                  title: 'Sanity Studio',
                  name: 'preview-nextjs-landing-pages-studio',
                  apiId: '37494e69-2554-4af1-994c-81515a91fc8b'
                },
                {
                  buildHookId: '5dbd42c2438e3aca7cc77e4b',
                  title: 'Landing pages Website',
                  name: 'preview-nextjs-landing-pages',
                  apiId: 'd4dde4ce-7dc3-4c68-9ccc-6b9ff6a9e5d7'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/thomax/preview-nextjs-landing-pages',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://preview-nextjs-landing-pages.netlify.com', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recently edited', order: '_updatedAt desc', limit: 10, types: ['page']},
      layout: {width: 'medium'}
    }
  ]
}
