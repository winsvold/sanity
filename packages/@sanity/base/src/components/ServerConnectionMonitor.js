import React, {PureComponent} from 'react'

class ServerConnectionMonitor extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = {}
  }

  handleClose() {
    this.setState({result: null})
  }

  componentDidMount() {
    const evtSource = new EventSource('/__sanity_dev_server')
    evtSource.onerror = err => {
      console.error('EventSource failed:', err)
    }
    evtSource.onopen = () => {
      console.info('EventSource open')
    }
  }

  render() {
    return <h2>ssshelo</h2>
  }
}

export default ServerConnectionMonitor
