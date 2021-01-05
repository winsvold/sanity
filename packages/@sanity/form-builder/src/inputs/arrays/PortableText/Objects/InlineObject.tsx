import React, {FunctionComponent, useCallback} from 'react'
import {isEqual} from 'lodash'
import classNames from 'classnames'
import {PortableTextChild, Type, RenderAttributes} from '@sanity/portable-text-editor'
import {Path, Marker, isValidationErrorMarker} from '@sanity/types'

import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import Preview from '../../../../Preview'
import {PatchEvent} from '../../../../PatchEvent'

import styles from './InlineObject.css'

type Props = {
  value: PortableTextChild
  type: Type
  attributes: RenderAttributes
  readOnly: boolean
  markers: Marker[]
  onFocus: (path: Path) => void
  onChange: (patchEvent: PatchEvent, path: Path) => void
}

export const InlineObject: FunctionComponent<Props> = ({
  value,
  type,
  markers,
  attributes: {focused, selected, path},
  onFocus,
  readOnly,
}) => {
  const errors = markers.filter(isValidationErrorMarker)
  const classnames = classNames([
    styles.root,
    focused && styles.focused,
    selected && styles.selected,
    errors.length > 0 && styles.hasErrors,
  ])

  const handleOpen = useCallback(() => {
    if (focused) {
      onFocus(path.concat(FOCUS_TERMINATOR))
    }
  }, [focused, onFocus, path])

  const isEmpty = !value || isEqual(Object.keys(value), ['_key', '_type'])

  return (
    <span className={classnames} onClick={handleOpen}>
      <span
        className={styles.previewContainer}
        // TODO: Probably move to styles aka. className?
        style={readOnly ? {cursor: 'default'} : {}}
      >
        {!isEmpty && <Preview type={type} value={value} layout="inline" />}
        {isEmpty && !readOnly && <span>Click to edit</span>}
      </span>
    </span>
  )
}
