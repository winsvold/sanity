/**
 *
 *
 *
 *
 *
 *
 *
 * HEADSUP: This is not in use, but keep for later reference
 *
 *
 *
 *
 *
 *
 *
 */

import React from 'react'
import {diffJson} from 'diff'
import styles from './Diff.css'

function getDiffStatKey(part) {
  if (part.added) {
    return 'added'
  }
  if (part.removed) {
    return 'removed'
  }
  return 'neutral'
}

interface DiffProps {
  inputA?: string
  inputB?: string
}

export default class Diff extends React.PureComponent<DiffProps> {
  static defaultProps = {
    inputA: '',
    inputB: ''
  }

  render() {
    const diff = diffJson(this.props.inputA, this.props.inputB)
    return (
      <pre>
        {diff.map((part, index) => (
          <span key={index} className={styles[getDiffStatKey(part)]}>
            {part.value}
          </span>
        ))}
      </pre>
    )
  }
}
