import * as React from 'react'

interface Props {
  children: React.ReactNode
  field: any
}

const FieldDiffContext = React.createContext<any>({field: {type: 'undefined'}})

export function FieldDiffProvider(props: Props) {
  return (
    <FieldDiffContext.Provider value={{field: props.field}}>
      {props.children}
    </FieldDiffContext.Provider>
  )
}

export function useFieldDiff() {
  return React.useContext(FieldDiffContext)
}
