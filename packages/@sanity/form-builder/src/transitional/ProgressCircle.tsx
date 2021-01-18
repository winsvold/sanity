import React from 'react'
import {ProgressCirclePart} from '../legacyPluginParts'

interface Props {
  percent?: number
  text?: string
  style?: React.CSSProperties
  showPercent?: boolean
  isComplete?: boolean
  isInProgress?: boolean
}

export function ProgressCircle(props: Props) {
  return <ProgressCirclePart {...props} />
}
