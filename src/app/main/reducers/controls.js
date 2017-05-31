import buildReducer from '../../../redux/buildReducer'
import * as Action from '../action'

export default buildReducer({
  [Action.PomodoroStarted]: () => ({ start_disabled: true, squash_disabled: false }),
  [Action.PomodoroCompleted]: () => ({ start_disabled: false, squash_disabled: true }),
})