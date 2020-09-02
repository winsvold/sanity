import React from 'react'
import PublishIcon from 'part:@sanity/base/publish-icon'
import EditIcon from 'part:@sanity/base/edit-icon'
import styles from './documentSparkline.css'

const ICONS = {
  publish: PublishIcon,
  editDraft: EditIcon
}

const MAX_SESSIONS = 3

const splitRight = (array: object[], max: number): [object[], object[]] => {
  const idx = Math.max(0, array.length - max)
  return [array.slice(0, idx), array.slice(idx)]
}

interface Props {
  timeline: any
  disabled: boolean
}

export function DocumentSparkline({timeline, disabled = false}: Props) {
  // TODO
  const chunks = timeline
    .mapChunks(chunk => chunk)
    .filter(chunk => ['publish', 'editDraft'].includes(chunk.type))
  const publishedIndex = chunks.findIndex(chunk => chunk.type === 'publish')
  const hasBeenPublished = publishedIndex !== -1
  const chunksSinceLastPublished = chunks.slice(0, publishedIndex)
  const [hiddenChunks, visibleChunks] = splitRight(chunksSinceLastPublished, MAX_SESSIONS)
  return (
    <div className={styles.root} data-disabled={disabled}>
      {visibleChunks.length > 0 && <div className={styles.timeline} />}
      <div className={styles.item} data-status={hasBeenPublished ? 'publish' : 'editDraft'}>
        {hasBeenPublished ? <PublishIcon /> : <EditIcon />}
      </div>
      {hasBeenPublished && (
        <div className={styles.compressed}>
          {visibleChunks.map((chunk: any, idx) => {
            const Icon = ICONS[chunk.type]
            return (
              <div key={idx} className={styles.item} data-status={chunk.type}>
                {Icon && <Icon />}
              </div>
            )
          })}
          {/* {hiddenChunks.length > 0 && (
            <div className={styles.item}>{`+${hiddenChunks.length}`}</div>
          )} */}
        </div>
      )}
    </div>
  )
}
