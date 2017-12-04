import {Component} from 'react'
import request from "superagent";
import setting from 'settings';

export default class Ping extends Component {
  constructor(){
    super()
    this.state = {counter: 0}
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    const ws = new WebSocket('ws://localhost:4000/ws')
    ws.onmessage = msg => {
      const evt = JSON.parse(msg.data)
      if (evt.event === 'Pong') {
        (this.setState({counter: evt.counter}))
      }
    }
  }

  componentWillUnmount() {
    this.ws.close()
  }

  handleClick() {
    request
      .post(`${settings.host}/commands`)
      .set('Content-Type', 'application/json')
      .send({command: 'Ping'})
      .end()
  }

  render() {
    const buttonStyle = {
      backgroundColor: '#FFFF00'
    }

    return (
      <div>
        <label className="big-label">{this.state.counter}</label>
        <button style={buttonStyle} onClick={this.handleClick}>Ping</button>
      </div>
    )
  }
}