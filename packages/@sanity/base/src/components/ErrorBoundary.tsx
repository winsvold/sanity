import React from 'react'

interface ErrorBoundaryProps {
  onCatch: (params: {error: Error; info: React.ErrorInfo}) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onCatch({error, info})
  }

  render() {
    return this.props.children
  }
}
