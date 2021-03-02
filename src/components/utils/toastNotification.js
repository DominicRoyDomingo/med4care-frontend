{
  /*
   * toastNotification.js
   *
   * Reusable component for Toast Notifications
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React from 'react'
import { Toast } from 'react-bootstrap'

const dangerStyle = {
  color: `#721c24`,
  backgroundColor: `#f8d7da`,
  borderColor: `#f5c6cb`,
  fontWeight: `500`,
}

const successStyle = {
  color: `#155724`,
  backgroundColor: `#d4edda`,
  borderColor: `#c3e6cb`,
  fontWeight: `500`,
}

class ToastNotification extends React.Component {
  constructor(props) {
    super(props)
  }

  getStyle() {
    if (this.props.variant === 'danger') {
      return dangerStyle
    } else if (this.props.variant === 'success') {
      return successStyle
    } else {
      return null
    }
  }
  render() {
    return (
      <Toast
        className={this.props.variant}
        show={this.props.show}
        onClose={() => {
          this.props.handleHideToast()
        }}
        style={
          this.props.show
            ? {
                position: `fixed`,
                top: `85px`,
                right: `20px`,
                zIndex: `9999`,
                border: `1px solid #888`,
              }
            : { zIndex: `1`, display: `none` }
        }
      >
        <Toast.Header style={this.getStyle()}>
          <strong className="mr-auto">{this.props.heading}</strong>
        </Toast.Header>
        <Toast.Body style={this.getStyle()}>{this.props.message}</Toast.Body>
      </Toast>
    )
  }
}

export default ToastNotification
