import { Component } from 'react'

export default class Hello extends Component {
  constructor(){
    super()
    this.state = {counter: 0}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click</button>
        <CounterLabel count={this.state.counter}/>
      </div>
    )
  }
}

class CounterLabel extends Component{
  render() {
    return <div>{this.props.count}</div>
  }
}