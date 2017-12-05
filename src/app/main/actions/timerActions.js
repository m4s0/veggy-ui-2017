import sendCommand from '../../sendCommand'
import settings from 'settings'

const timerActions = {
  startPomodoro(timer_id, description) {
    var cmd = {
      command: 'StartPomodoro',
      duration: settings.duration,
      timer_id: timer_id,
      description: description
    }
    sendCommand(cmd)
  },
  squashPomodoro() {
    var cmd = {
      command: 'SquashPomodoro'
    }
    sendCommand(cmd)
  }
}

export default timerActions