{
  /*
   * modalNotification.js
   *
   * Reusable component for Modal Notifications
   *
   * Author: Dominic Domingo
   * Created: 12/02/2019
   *
   */
}

import React from 'react'
import { Modal } from 'react-bootstrap'

class ModalNotification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true,
      heading: this.props.heading,
      message: this.props.message,
      footer: this.props.footer,
    }
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => {
          this.props.handleHideModal()
        }}
        style={{
          marginTop: `10%`,
        }}
      >
        <Modal.Header>
          <Modal.Title
            style={{
              color: `#565656`,
              fontSize: `20px`,
              fontWeight: `600`,
              textTransform: `upper`,
            }}
          >
            {this.props.heading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            textAlign: `center`,
          }}
        >
          {this.props.message}
        </Modal.Body>
        <Modal.Footer>{this.props.footer}</Modal.Footer>
      </Modal>
    )
  }
}

export default ModalNotification
