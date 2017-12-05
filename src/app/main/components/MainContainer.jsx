import React from 'react'
import Display from './Display'
import Controls from './Controls'
import timerActions from '../actions/timerActions'
import DescriptionModal from './DescriptionModal'
import dispatcher from '../../../redux/dispatcher'
import * as Action from '../action'

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleCancelStart = this
      .handleCancelStart
      .bind(this)
    this.handleStart = this
      .handleStart
      .bind(this)
    this.handleStartRequest = this
      .handleStartRequest
      .bind(this)
    this.handleSquashRequest = this
      .handleSquashRequest
      .bind(this)
  }
  handleStart(description) {
    timerActions.startPomodoro(this.props.timer_id, this.props.users, description)
  }
  handleStartRequest() {
    dispatcher.dispatch({type: Action.StartRequested, payload: {}})
  }
  handleCancelStart() {
    dispatcher.dispatch({type: Action.StartCanceled, payload: {}})
  }
  handleSquashRequest() {
    timerActions.squashPomodoro()
    // mi puo servire questo nel caso in cui voglia gestire uan modale ad esempio
    // dispatcher.dispatch({type: Action.SquashRequested, payload: {}})
  }
  render() {
    return (
      <div>
        <DescriptionModal
          isActive={this.props.need_description}
          onStart={this.handleStart}
          onCancel={this.handleCancelStart}/>
        <div className="container" style={{
          marginTop: '20px'
        }}>
          <div className="columns">
            <Display time={this.props.time}/>
            <Controls
              startDisabled={this.props.start_disabled}
              onStart={this.handleStartRequest}
              squashDisabled={this.props.squash_disabled}
              onSquash={this.handleSquashRequest}/>
          </div>
        </div>
      </div>
    )
  }
}

export default MainContainer
