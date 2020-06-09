import * as React from 'react'
import {ObjectField} from './types'

interface FieldDiffContextValue {
  field: ObjectField
  title: string
}

type Props = {
  children: React.ReactNode
  field: ObjectField
}

const FieldDiffContext = React.createContext<FieldDiffContextValue>({
  get field(): ObjectField {
    throw new Error('No field provider given')
  },
  title: ''
})

export function FieldDiffProvider(props: Props): React.ReactElement {
  const {field, children} = props
  const value = React.useMemo((): FieldDiffContextValue => {
    const title = field.title || field.type.title || field.name
    return {field, title}
  }, [field])

  return <FieldDiffContext.Provider value={value}>{children}</FieldDiffContext.Provider>
}

export function useFieldDiff(): FieldDiffContextValue {
  return React.useContext(FieldDiffContext)
}
