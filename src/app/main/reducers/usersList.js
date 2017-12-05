import buildReducer from '../../../redux/buildReducer'
import * as Action from '../action'

export default buildReducer({
  [Action.UsersLoaded]: (state, action) => ({users: action.payload})
})