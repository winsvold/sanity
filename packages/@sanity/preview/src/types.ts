export type Id = string

export type Reference = {_ref: string}
// export type Document = {_id: string}
export type Document = {
  _id?: string
  _type?: string
  _rev?: string
  _updatedAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type Value = Document | Reference | any

export type FieldName = string

export type Path = FieldName[]
export type Selection = [Id, FieldName[]]
export type ViewOptions = {}

export type PreviewConfig = {
  select: {
    title: string
    subtitle: string
    description: string
  }
}
export type Type = {
  preview: PreviewConfig
  type: Type | null
  icon: any
  name: string
  to: any // todo fixme
}
