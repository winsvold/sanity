import React from 'react'
import MdSettings from 'react-icons/lib/md/settings'
import MdPerson from 'react-icons/lib/md/person'
import ContextualPreviews from 'part:sanity-plugin-contextual-previews/contextual-previews-component'
import S from '@sanity/desk-tool/structure-builder'
import {PaneRouterContext} from '@sanity/desk-tool'

const hiddenDocTypes = listItem =>
  !['category', 'author', 'post', 'siteSettings'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .icon(MdSettings)
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Blog posts')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Blog posts')),
      S.listItem()
        .title('Authors')
        .icon(MdPerson)
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .child(documentId =>
              S.editor()
                .documentId(documentId)
                .schemaType('author')
                .child(childId => {
                  if (childId === 'preview') {
                    // It's preview time!
                    console.log('-------------')
                    return S.component()
                      .title('Preview')
                      .component(() => (
                        <PaneRouterContext.Consumer>
                          {context => <ContextualPreviews {...context.getPayload()} />}
                        </PaneRouterContext.Consumer>
                      ))
                  }
                  // Not preview, but something else
                  return S.component()
                    .title(childId)
                    .component(props => (
                      <pre>
                        <code>{JSON.stringify(props, null, 2)}</code>
                      </pre>
                    ))
                })
            )
        ),
      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
