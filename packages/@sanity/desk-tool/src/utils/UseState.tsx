import * as React from 'react'

interface UseStateProps {
  startWith?: any
  children: (args: [any, (value: any) => void]) => React.ReactNode
}

export default class UseState extends React.Component<UseStateProps, {value: any}> {
  constructor(props: UseStateProps) {
    super(props)
    this.state = {value: props.startWith}
  }

  setValue = (nextValue: any) => this.setState({value: nextValue})

  render() {
    return this.props.children([this.state.value, this.setValue])
  }
}
