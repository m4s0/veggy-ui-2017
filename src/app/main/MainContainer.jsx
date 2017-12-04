import React from 'react'
import request from 'superagent'
import Display from './Display'
import Controls from './Controls'
import stringifyTime from './stringifyTime'

const duration = 60 * 1000 // 60 * 1000 * 25
let timerId = null

const subscribers = new Map()

const dispatcher = {
  register: (fn) => {
    const sid = `s_${subscribers.size + 1}`
    subscribers.set(sid, fn)
    return sid
  },
  dispatch: (action) => {
    subscribers.forEach(fn => fn(action))
  }
}

class MainContainer extends React.Component {
  constructor() {
    super()
    this.handleStart = this.handleStart.bind(this)
  }

  componentDidMount() {
    wsClient.connect()
  }

  handleStart() {
    actions.startPomodoro(duration)
  }

  render() {
    return (
      <div>
        <div className="container" style={{
          marginTop: '20px'
        }}>
          <div className="columns">
            <Display time={stringifyTime(this.props.time)}/>
            <Controls startDisabled={this.props.startDisabled} onStart={this.handleStart}/>
          </div>
        </div>
      </div>
    )
  }
}

const actions = {
  startPomodoro(d) {
    request
      .post('http://localhost:4000/commands')
      .set('Content-Type', 'application/json')
      .send({command: 'StartPomodoro', duration: d})
      .end()
  }
}

const wsClient = {
  connect() {
    const ws = new WebSocket('ws://localhost:4000/ws')
    ws.onopen = () => {
      setInterval(() => ws.send('ping'), 5000)
    }

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data)

      if (data.event === 'PomodoroStarted') {
        this.ms = duration

        timerId = setInterval(() => {
          this.ms = this.ms - 1000
          dispatcher.dispatch({
            type: 'UPDATE_TIMER',
            payload: {
              time: this.ms
            }
          })
        }, 1000)

        dispatcher.dispatch({type: 'POMODORO_STARTED', payload: {}})
      }

      if (data.event === 'PomodoroCompleted') {
        clearInterval(timerId)
        dispatcher.dispatch({type: 'POMODORO_COMPLETED', payload: {}})
      }
    }
  }
}

const INITIAL_STATE = {
  time: duration,
  startDisabled: false,
  squashDisabled: true
}

// f :: (s,a) -> s

function pomodoroStarted(state, action) {
  if (action.type === 'POMODORO_STARTED') {
    return {startDisabled: true, squashDisabled: false}
  }
  return state
}

function updateTimer(state, action) {
  if (action.type === 'UPDATE_TIMER') {
    return {time: action.payload.time}
  }
  return state
}

function pomodoroCompleted(state, action) {
  if (action.type === 'POMODORO_COMPLETED') {
    return {startDisabled: false, squashDisabled: true}
  }
  return state
}

// funzionamento reducer console.log([1, 2, 3, 4].reduce((acc, v) => {   return
// acc + v }, 0))

function withState(InnerComponent, reducers, initialState) {
  return class WithState extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        innerState: initialState
      }
    }

    componentWillMount() {
      dispatcher.register(a => {
        const newState = reducers.reduce((ps, red) => {
          return Object.assign(ps, red(ps, a))
        }, this.state.innerState)
        this.setState({innerState: newState})
      })
    }

    render() {
      return <InnerComponent {...this.state.innerState}/>
    }
  }
}

export default withState(MainContainer, [
  pomodoroStarted, updateTimer, pomodoroCompleted
], INITIAL_STATE)