import * as React from 'react'
import styles from './ObjectFieldDiff.css'
import {DiffComponent} from './types'
import {ObjectDiff} from '../types'
import {FieldDiff} from './FieldDiff'
import {FieldDiffProvider, useFieldDiff} from './fieldDiffProvider'

export const ObjectFieldDiff: DiffComponent<ObjectDiff> = function ObjectFieldDiff({
  schemaType,
  fields
}) {
  const {title} = useFieldDiff()

  if (!schemaType.fields) {
    console.warn('Invalid schema type passed to object field diff, no `fields` present')
    return null
  }

  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{title}</h4>

      <div className={styles.diffCardList}>
        {schemaType.fields.map(field => {
          const fieldDiff = fields[field.name]
          if (!fieldDiff) {
            return null
          }

          return (
            <FieldDiffProvider key={field.name} field={field}>
              <FieldDiff schemaType={field.type} {...fieldDiff} />
            </FieldDiffProvider>
          )
        })}
      </div>
    </div>
  )
}
