import * as React from 'react'
import {Diff} from '../types'
import {ObjectField} from './types'

interface FieldDiffContextValue {
  field: ObjectField
  title: string
  diff: Diff
}

type Props = {
  children: React.ReactNode
  field: ObjectField
  diff: Diff
}

const FieldDiffContext = React.createContext<FieldDiffContextValue>({
  get field(): ObjectField {
    throw new Error('No field provider given')
  },
  get diff(): Diff {
    throw new Error('No field provider given')
  },
  title: ''
})

export function FieldDiffProvider(props: Props): React.ReactElement {
  const {field, children, diff} = props
  const value = React.useMemo((): FieldDiffContextValue => {
    const title = field.title || field.type.title || field.name
    return {field, title, diff}
  }, [field, diff])

  return <FieldDiffContext.Provider value={value}>{children}</FieldDiffContext.Provider>
}

export function useFieldDiff(): FieldDiffContextValue {
  return React.useContext(FieldDiffContext)
}
