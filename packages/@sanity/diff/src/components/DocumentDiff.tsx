import * as React from 'react'
import {ObjectDiff} from '../types'
import styles from './DocumentDiff.css'
import {DiffComponent} from './types'
import {FieldDiff} from './FieldDiff'
import {FieldDiffProvider} from './fieldDiffProvider'

export const DocumentDiff: DiffComponent<ObjectDiff> = function DocumentDiff({schemaType, fields}) {
  if (!schemaType.fields) {
    console.warn('Invalid schema type passed to document diff, no `fields` present')
    return null
  }

  return (
    <div className={styles.diffCardList}>
      {schemaType.fields.map(field => {
        const fieldDiff = fields[field.name]
        if (!fieldDiff) {
          return null
        }

        return (
          <FieldDiffProvider key={field.name} field={field} diff={fieldDiff}>
            <FieldDiff schemaType={field.type} {...fieldDiff} />
          </FieldDiffProvider>
        )
      })}
    </div>
  )
}
