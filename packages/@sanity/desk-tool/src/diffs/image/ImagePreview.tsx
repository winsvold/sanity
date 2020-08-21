import React from 'react'
import RemoveIcon from 'part:@sanity/base/trash-icon' // TODO: replace with remove-circle icon
import AddIcon from 'part:@sanity/base/plus-circle-outline-icon'
import EditIcon from 'part:@sanity/base/edit-icon'
import imageUrlBuilder from '@sanity/image-url'
import sanityClient from 'part:@sanity/base/client'
import {getRefValue} from '../hooks'
import styles from './ImagePreview.css'
import {ImagePreviewProps} from './types'

const imageBuilder = imageUrlBuilder(sanityClient)

const ICONS = {
  added: AddIcon,
  removed: RemoveIcon,
  changed: EditIcon
}

export default function ImagePreview({
  asset,
  color = {background: '', text: ''},
  action = 'changed',
  hotspot,
  crop
}: ImagePreviewProps) {
  if (asset) {
    const value: any = getRefValue(asset._ref)
    if (!value) {
      return null
    }
    const title = value.originalFilename || 'Untitled'
    const dimensions = value?.metadata?.dimensions
    const Icon = ICONS[action]
    const imageSource = imageBuilder.image(asset).height(300)
    return (
      <div className={styles.root} style={{background: color.background, color: color.text}}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            src={imageSource.url() || ''}
            alt={title}
            data-action={action}
          />
        </div>
        <div className={styles.meta} data-action={action}>
          <div className={styles.icon} title={action}>
            <Icon />
          </div>
          <div className={styles.info}>
            <h3 className={styles.title} title={title}>
              {title}
            </h3>
            {dimensions && (
              <div>
                {['added', 'removed'].includes(action)
                  ? action
                  : `${dimensions.height}x${dimensions.width}`}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  return null
}
