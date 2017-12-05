import buildReducer from '../../../redux/buildReducer'
import * as Action from '../action'

export default buildReducer({
  [Action.TimersLoaded]: (state, action) => ({tasks: action.payload})
})