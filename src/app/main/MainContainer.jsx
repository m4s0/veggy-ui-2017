import {Component} from 'react';
import settings from "settings";
import request from "superagent";
import stringifyTime from "./stringifyTime";

export default class MainContainer extends Component {
  constructor(props) {
    super(props)
    this.handleStartPomodoro = this.handleStartPomodoro.bind(this)
    this.state = {
      time: settings.duration,
      startDisabled: false,
      squashDisabled: true
    }
  }

  componentWillMount() {
    this.ws = new WebSocket(settings.wsHost)

    this.ws.onopen = () => {
      setInterval(() => this.ws.send('ping'), 5000)
    }

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      if (data.event === 'PomodoroStarted') {
        let ms = settings.duration

        this.timerId = setInterval(() => {
          ms = ms - 1000
          this.setState({time: ms})
        }, 1000)
      }

      if (data.event === 'PomodoroCompleted') {
        clearInterval(this.timerId)
        this.setState({time: settings.duration, startDisabled: false, squashDisabled: true})
      }
    }
  }

  handleStartPomodoro() {
    request
      .post(`${settings.host}/commands`)
      .set('Content-Type', 'application/json')
      .send({command: 'StartPomodoro', duration: settings.duration})
      .then(() => {
        this.setState({startDisabled: true, squashDisabled: false})
      })
  }

  render() {
    return (
      <div>
        <div>
          <Display time={this.state.time}/>
        </div>
        <Controls
          onStart={this.handleStartPomodoro}
          startDisabled={this.state.startDisabled}
          squashDisabled={this.state.squashDisabled}/>
      </div>
    )
  }
}

function Display({time}) {
  return <h3>{stringifyTime(time)}</h3>
}

function Controls({onStart, startDisabled, squashDisabled}) {
  return (
    <div>
      <button onClick={onStart} disabled={startDisabled}>Start Pomodoro</button>
      <button disabled={squashDisabled}>Squash Pomodoro</button>
    </div>
  )
}
