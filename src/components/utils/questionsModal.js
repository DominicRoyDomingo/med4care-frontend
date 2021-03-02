{
  /*
   * questionsModal.js
   *
   * Reusable component for Questions Modal
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React from 'react'
import { Modal } from 'react-bootstrap'

class QuestionsModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true,
      message: this.props.message,
    }
  }

  render() {
    return (
      <Modal
        className="questionModal__container"
        show={this.props.show}
        size="lg"
        centered
      >
        <Modal.Body className="questionModal__body">
          {this.props.message}
        </Modal.Body>
      </Modal>
    )
  }
}

export default QuestionsModal
