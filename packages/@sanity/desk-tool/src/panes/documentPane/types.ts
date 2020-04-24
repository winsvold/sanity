export interface Doc {
  _id?: string
  _type: string
  _rev?: string
  _updatedAt?: string
  [key: string]: any
}

export interface MenuAction {
  action: string
  icon?: React.FunctionComponent | React.Component
  isDisabled?: boolean
  title: React.ReactNode
  url?: string
}

export interface DocumentViewType {
  type: string
  id: string
  title: string
  options: {}
  component: React.ComponentType<any>
}
