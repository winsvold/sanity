import {Dialog} from '@sanity/ui'
import React from 'react'

import styles from './updateNotifierDialog.css'

interface Props {
  onClose: () => void
  versions: {[key: string]: string}
}

export function CurrentVersionsDialog(props: Props) {
  const {onClose, versions = []} = props

  return (
    <Dialog id="current-versions" onClose={onClose} width={2}>
      <div className={styles.content}>
        <h2 className={styles.dialogHeading}>This Studio is up to date</h2>
        <p>It was built using the latest versions of all packages.</p>
        <details className={styles.details}>
          <summary className={styles.summary}>List all installed packages</summary>
          <table className={styles.versionsTable}>
            <thead>
              <tr>
                <th>Module</th>
                <th>Installed</th>
                <th>Latest</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(versions).map(pkgName => (
                <tr key={pkgName}>
                  <td>{pkgName}</td>
                  <td>{versions[pkgName]}</td>
                  <td>{versions[pkgName]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>
    </Dialog>
  )
}
