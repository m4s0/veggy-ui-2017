import {Component} from 'react'
import Modal from '../../Modal'

class DescriptionModal extends Component {
  constructor(props) { 
    super(props)
    this.handleOkClick = this.handleOkClick.bind(this)
  }

  // con react ho 2 possibilità per leggere il contenuto di un input di un form: onChange oppure come qui onOkClick
  // in questo caso leggo il contenuto del contentuto di ref="description"
  handleOkClick() {
    const description = this.refs.description.value
    this.props.onStart(description)
  }
  render(){
    return (
      <Modal isActive={this.props.isActive} okBtnLabel="Start" cancelBtnLabel="Cancel" onOkClick={this.handleOkClick} onCancelClick={this.props.onCancel}>
        <div className="field">
          <label className="label">Pomodoro description</label>
          <p className="control">
            <textarea ref="description" className="textarea" placeholder="What are you doing?"></textarea>
          </p>
        </div>
      </Modal>
    )
  }
}

export default DescriptionModal