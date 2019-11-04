export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-gatsby-blog'
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
                  buildHookId: '5dbd3fd170b27913fa7865a5',
                  title: 'Sanity Studio',
                  name: 'preview-gatsby-blog-studio',
                  apiId: '11bbc4a3-fdf7-40bb-aabc-b6b7abfce65e'
                },
                {
                  buildHookId: '5dbd3fd1e0516ba2ab37da7e',
                  title: 'Blog Website',
                  name: 'preview-gatsby-blog',
                  apiId: 'fa3a7d8c-42d4-4a64-badc-29b7637e62f1'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/thomax/preview-gatsby-blog',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://preview-gatsby-blog.netlify.com', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recent blog posts', order: '_createdAt desc', types: ['post']},
      layout: {width: 'medium'}
    }
  ]
}
