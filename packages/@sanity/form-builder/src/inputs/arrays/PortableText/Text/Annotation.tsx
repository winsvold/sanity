import {PortableTextChild, RenderAttributes} from '@sanity/portable-text-editor'
import {Path, Marker, isValidationErrorMarker} from '@sanity/types'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'
import {Card} from '@sanity/ui'
import React, {SyntheticEvent, useCallback, useMemo} from 'react'
import styled from 'styled-components'

interface AnnotationProps {
  value: PortableTextChild
  children: JSX.Element
  attributes: RenderAttributes
  markers: Marker[]
  onFocus: (path: Path) => void
}

const Root = styled(Card).attrs({forwardedAs: 'span'})`
  text-decoration: none;
  position: relative;

  &:not([hidden]) {
    display: inline;
  }

  &[data-focused='true'] {
    /* @todo */
    outline: 1px solid #00f;
  }

  &[data-seleced='true'] {
    /* @todo */
    outline: 1px solid #000;
  }
`

export function Annotation(props: AnnotationProps) {
  const {children, markers, attributes, value, onFocus} = props
  const {focused, selected, path: pathAttr} = attributes
  const errors = markers.filter(isValidationErrorMarker)

  const markDefPath = useMemo(() => [...pathAttr.slice(0, 1), 'markDefs', {_key: value._key}], [
    pathAttr,
    value._key,
  ])

  const handleClick = useCallback(
    (event: SyntheticEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
      onFocus(markDefPath.concat([FOCUS_TERMINATOR]))
    },
    [markDefPath, onFocus]
  )

  return (
    <Root
      data-focused={focused}
      data-selected={selected}
      onClick={handleClick}
      tone={errors.length > 0 ? 'critical' : 'transparent'}
    >
      {children}
    </Root>
  )
}
