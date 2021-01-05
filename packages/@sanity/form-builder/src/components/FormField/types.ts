interface ValidationWarning {
  type: 'warning'
  label: string
}

interface ValidationError {
  type: 'error'
  label: string
}

export type Validation = ValidationWarning | ValidationError
