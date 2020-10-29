export interface Router {
  state: {space?: string; tool: string}
  navigate: () => void
}
