import React, {SyntheticEvent, useCallback, useMemo} from 'react'
import classNames from 'classnames'
import {
  PortableTextChild,
  // Type,
  RenderAttributes,
} from '@sanity/portable-text-editor'

import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import {Path, Marker, isValidationErrorMarker} from '@sanity/types'
// import {PatchEvent} from '../../../../PatchEvent'

import styles from './Annotation.css'

type Props = {
  value: PortableTextChild
  // type: Type
  children: JSX.Element
  attributes: RenderAttributes
  // readOnly: boolean
  markers: Marker[]
  onFocus: (path: Path) => void
  // onChange: (patchEvent: PatchEvent, path: Path) => void
}

export function Annotation({
  children,
  markers,
  attributes: {focused, selected, path},
  value,
  onFocus,
}: Props) {
  const errors = markers.filter(isValidationErrorMarker)

  const classnames = classNames(
    styles.root,
    focused && styles.focused,
    selected && styles.selected,
    errors.length > 0 ? styles.error : styles.valid
  )

  const markDefPath = useMemo(() => [...path.slice(0, 1), 'markDefs', {_key: value._key}], [
    path,
    value._key,
  ])

  const handleOpen = useCallback(
    (event: SyntheticEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
      onFocus(markDefPath.concat(FOCUS_TERMINATOR))
    },
    [markDefPath, onFocus]
  )

  return (
    <span className={classnames} onClick={handleOpen}>
      {children}
    </span>
  )
}
