import request from 'superagent'
import moment from 'moment'
import settings from 'settings'
import dispatcher from '../../../redux/dispatcher'
import ws from '../../../redux/webSocketStream'
import pomodoroTicker from './pomodoroTicker'
import * as Action from '../action'

function getElapsed(time) {
  const startedAt = moment(time)
  const elapsed = settings.duration - moment().diff(startedAt)
  return elapsed
}

function getPomodoriOfTheDay(timer_id) {
  const today = moment().format('YYYY-MM-DD')
  return request
    .get(`${settings.host}/projections/pomodori-of-the-day?day=${today}&timer_id=${timer_id}`)
    .then(res => {
      dispatcher.dispatch({type: Action.TimersLoaded, payload: res.body})
    })
    .catch(err => {
      dispatcher.dispatch({type: Action.ApiError, payload: err})
    })
}

function getLatestsPomodori() {
  return request
    .get(`${settings.host}/projections/latest-pomodori`)
    .then(res => {
      dispatcher.dispatch({type: Action.UsersLoaded, payload: res.body})
    })
    .catch(err => {
      dispatcher.dispatch({type: Action.ApiError, payload: err})
    })
}

function resumeTimer(userInfo) {
  return request
    .get(`${settings.host}/projections/latest-pomodoro?timer_id=${userInfo.timer_id}`)
    .then(res => {
      if (res.body.status === 'started') {
        const elapsed = getElapsed(res.body.started_at)
        pomodoroTicker.start(elapsed)
        dispatcher.dispatch({
          type: Action.ResumeTimer,
          payload: {
            time: elapsed,
            timer_id: res.body.timer_id,
            pomodoro_id: res.body.pomodoro_id
          }
        })
      }
    })
    .catch(err => {
      if (err.status !== 404) {
        dispatcher.dispatch({type: Action.ApiError, payload: err})
      }
    })
}

const resumeActions = {
  wireup() {
    if (window.localStorage.getItem('veggy')) {
      const user = JSON.parse(window.localStorage.getItem('veggy'))
      ws.sendCommand(`login:${user.username}`)
      resumeTimer(user).then(() => dispatcher.dispatch({type: Action.Init, payload: user}))
      getPomodoriOfTheDay(user.timer_id)
      getLatestsPomodori()
    } else {
      dispatcher.dispatch({type: Action.NeedLogin, payload: {}})
    }
  }
}

export default resumeActions
