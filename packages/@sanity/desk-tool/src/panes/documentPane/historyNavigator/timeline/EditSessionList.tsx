/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/no-array-index-key */

import * as React from 'react'
import {EditSession} from '../types'

import styles from './EditSessionList.css'

interface Props {
  isSelected: boolean
  sessions: EditSession[]
}

function EditSessionList({isSelected, sessions}: Props) {
  return (
    <div className={isSelected ? styles.isSelected : styles.root}>
      {sessions.map((session, sessionIndex) => (
        <button className={styles.session} key={sessionIndex} type="button">
          {session.edits.map((_, editIndex) => (
            <div key={editIndex} />
          ))}
        </button>
      ))}
    </div>
  )
}

export default EditSessionList
