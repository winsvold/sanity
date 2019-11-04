import React from 'react'
import MdSettings from 'react-icons/lib/md/settings'
import MdPerson from 'react-icons/lib/md/person'
import ContextualPreviews from 'part:sanity-plugin-contextual-previews/contextual-previews-component'
import S from '@sanity/desk-tool/structure-builder'
import {PaneRouterContext} from '@sanity/desk-tool'

const hiddenDocTypes = listItem =>
  !['category', 'author', 'post', 'siteSettings'].includes(listItem.getId())

function Preview(props) {
  return (
    <PaneRouterContext.Consumer>
      {context => {
        const doc = props.draft || props.published
        return <ContextualPreviews document={doc} types={['author']} />
      }}
    </PaneRouterContext.Consumer>
  )
}

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
        .child(
          S.documentTypeList('author')
            .title('Authors')
            .child(documentId =>
              S.document()
                .documentId(documentId)
                .schemaType('author')
                .views([S.view.form(), S.view.component(Preview)])
            )
        ),
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
