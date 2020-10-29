export interface Tool {
  canHandleIntent?: (intent: any, params: any, state: any) => any
  component?: React.ComponentType<any>
  icon?: React.ComponentType<any>
  getIntentState?: (intent: any, params: any, state: any, payload: any) => any
  name: string
  title: string
  router?: any
}
