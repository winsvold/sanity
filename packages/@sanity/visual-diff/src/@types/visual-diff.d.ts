declare module 'part:@sanity/visual-diff/summarizers?'
declare module 'part:@sanity/visual-diff/visualizers?'

export interface BatesonOptions {
  summarizers?: Summarizers
  ignoreFields?: string[]
}

export interface Summarizers {
  [typeToSummarize: string]: Summarizer
}

export interface Summarizer {
  resolve(a: any, b: any, path: string[]): DiffSummary
}

export interface DiffSummary {
  fields: string[]
  changes: IntermediateOperation[]
}

// Operation without path. TODO: Rename
export interface IntermediateOperation {
  operation: string
  from?: any
  to?: any
}

export interface Operation {
  operation: string
  path: string[]
  from?: any
  to?: any
}
