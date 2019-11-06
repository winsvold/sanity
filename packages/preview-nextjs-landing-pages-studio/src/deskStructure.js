import {MdDashboard, MdSettings} from 'react-icons/lib/md'
import S from '@sanity/desk-tool/structure-builder'

// We filter document types defined in structure to prevent
// them from being listed twice
const hiddenDocTypes = listItem =>
  !['page', 'route', 'site-config', 'person'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Site')
    .items([
      S.listItem()
        .title('Site config')
        .icon(MdSettings)
        .child(
          S.editor()
            .id('config')
            .schemaType('site-config')
            .documentId('global-config')
        ),
      S.listItem()
        .title('Pages')
        .icon(MdDashboard)
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),
      S.listItem()
        .title('Routes')
        .schemaType('route')
        .child(S.documentTypeList('route').title('Routes')),
      S.listItem()
        .title('Ads')
        .schemaType('ad')
        .child(S.documentTypeList('ad').title('Ads')),
      S.listItem()
        .title('People')
        .schemaType('person')
        .child(S.documentTypeList('person').title('People')),
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
