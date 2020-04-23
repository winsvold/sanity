/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/no-array-index-key */

import * as React from 'react'
import {EditSession} from '../types'

import styles from './EditSessionList.css'

interface Props {
  sessions: EditSession[]
}

function EditSessionList({sessions}: Props) {
  return (
    <div className={styles.root}>
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
