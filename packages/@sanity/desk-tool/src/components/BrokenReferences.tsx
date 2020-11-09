import {PanePopover} from '@sanity/base/__legacy/components'
import React from 'react'
import {streamingComponent} from 'react-props-stream'
import {merge, from, of, Observable} from 'rxjs'
import {map, switchMap, scan, filter, mergeMap} from 'rxjs/operators'
import {uniq, uniqBy} from 'lodash'
import {observePaths} from 'part:@sanity/base/preview'
import {getDraftId, getPublishedId} from 'part:@sanity/base/util/draft-utils'
import FormBuilder from 'part:@sanity/form-builder'
import {Pane} from '../components/pane'
import styles from './BrokenReferences.css'
import ReferringDocumentsList from './ReferringDocumentsList'

interface TmpDoc {
  draft?: {_type: string}
  published?: {_type: string}
}

interface DocumentRef {
  id: string
  type: string | undefined
  hasDraft: boolean
  hasPublished: boolean
}

interface BrokenRefsProps {
  schema?: any
  type?: string
  document?: any
  documents: DocumentRef[]
}

interface TmpRef2 {
  _weak?: boolean
}

function BrokenRefs(props: BrokenRefsProps) {
  const {documents, type, schema} = props
  const schemaType = schema.get(type)
  const {unpublished, nonExistent} = documents.reduce(
    (groups: {unpublished: DocumentRef[]; nonExistent: DocumentRef[]}, doc) => {
      const group = doc.hasDraft ? groups.unpublished : groups.nonExistent
      group.push(doc)
      return groups
    },
    {unpublished: [], nonExistent: []}
  )

  const renderNonExisting = nonExistent.length > 0
  const renderUnpublished = !renderNonExisting

  return (
    <Pane title={`New ${type}`} isScrollable={false}>
      <div className={styles.brokenReferences}>
        {renderNonExisting && (
          <PanePopover
            icon
            kind="error"
            id="missing-references"
            title="Missing references"
            subtitle={`The new document can only reference existing documents. ${
              nonExistent.length === 1 ? 'A document' : 'Documents'
            } with the following ID${nonExistent.length === 1 ? ' was' : 's were'} not found:`}
          >
            <ul className={styles.tagList}>
              {nonExistent.map(doc => (
                <li className={styles.tagItem} key={doc.id}>
                  {doc.id}
                </li>
              ))}
            </ul>
          </PanePopover>
        )}
        {renderUnpublished && (
          <PanePopover
            icon
            kind="warning"
            id="unpublished-documents"
            title="Unpublished references"
            subtitle={`A document can only refer to published documents. Publish the following ${
              unpublished.length === 1 ? 'draft' : 'drafts'
            } before creating
            a new document.`}
          >
            <ReferringDocumentsList
              documents={unpublished.map(({id, type: _type, hasDraft}) => ({
                _id: `drafts.${id}`,
                _type,
                _hasDraft: hasDraft
              }))}
            />
          </PanePopover>
        )}
      </div>
      <form className={styles.editor}>
        <FormBuilder readOnly type={schemaType} schema={schema} />
      </form>
    </Pane>
  )
}

// @todo consider adding a progress indicator instead?
const BrokenReferences = streamingComponent<{
  children?: React.ReactNode
  document: Record<string, unknown>
  type: string
  schema: Record<string, unknown>
}>(props$ =>
  props$.pipe(
    switchMap(props => {
      const ids = findReferences(props.document)
      const {type, schema} = props
      if (!ids.length) {
        return of(props.children)
      }

      const refs$ = from(ids).pipe(mergeMap(checkExistance))

      return refs$.pipe(
        scan((prev: DocumentRef[], curr) => uniqBy([curr, ...prev], 'id'), []),
        filter(docs => docs.length === ids.length),
        map(docs => docs.filter(isMissingPublished)),
        map(broken =>
          broken.length > 0 ? (
            <BrokenRefs documents={broken} type={type} schema={schema} />
          ) : (
            props.children
          )
        )
      )
    })
  )
)

function checkExistance(id: string): Observable<DocumentRef> {
  const tmp$: Observable<TmpDoc> = merge(
    observePaths(getDraftId(id), ['_type'] as any).pipe(map(draft => ({draft}))),
    observePaths(getPublishedId(id), ['_type'] as any).pipe(map(published => ({published})))
  )

  return tmp$.pipe(
    scan((prev: TmpDoc, res) => ({...prev, ...res}), {}),
    filter(res => 'draft' in res && 'published' in res),
    map(res => ({
      id,
      type: getDocumentType(res),
      hasDraft: Boolean(res.draft),
      hasPublished: Boolean(res.published)
    }))
  )
}

function getDocumentType({draft, published}: TmpDoc) {
  if (draft) return draft._type
  if (published) return published._type

  return undefined
}

function isMissingPublished(doc: {hasPublished: boolean}) {
  return !doc.hasPublished
}

function findReferences(value: TmpRef2 | TmpRef2[]) {
  return dedupeReferences(extractStrongReferences(value))
}

function extractStrongReferences(value: TmpRef2 | TmpRef2[]) {
  if (Array.isArray(value)) {
    return value.reduce((refs: TmpRef2[], item) => [...refs, ...extractStrongReferences(item)], [])
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce(
      (refs: any[], key) =>
        key === '_ref' && !value._weak
          ? [...refs, value[key]]
          : [...refs, ...extractStrongReferences(value[key])],
      []
    )
  }

  return []
}

function dedupeReferences(refs: string[]) {
  return uniq(refs.map(ref => (ref || '').replace(/^drafts\./, '')))
}

export default BrokenReferences
