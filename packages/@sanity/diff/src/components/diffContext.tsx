import * as React from 'react'

interface DiffContextValue {
  documentId: string
  schemaType: string
}

export const DiffContext = React.createContext<DiffContextValue>({
  get documentId(): string {
    throw new Error('No DiffContext provided')
  },
  get schemaType(): string {
    throw new Error('No DiffContext provided')
  }
})

export function DiffProvider(
  props: DiffContextValue & {children: React.ReactNode}
): React.ReactElement {
  const {documentId, schemaType, children} = props

  // For referential identity
  const value = React.useMemo((): DiffContextValue => ({documentId, schemaType}), [
    documentId,
    schemaType
  ])

  return <DiffContext.Provider value={value}>{children}</DiffContext.Provider>
}
