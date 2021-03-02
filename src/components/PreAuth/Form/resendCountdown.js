{
  /*
   * resendCountdown.js
   *
   * Countdown timer for email resending in
   * Sign up confirmation
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

const secondsToWait = 30
const Alert = props => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

class ResendCountdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: secondsToWait,
      alertVariant: 'error',
      alertMessage: 'Email is already in use.',
      showAlert: true,
    }
  }

  componentDidMount() {
    this.setState({
      alertVariant: 'success',
      alertMessage: 'We have sent you a confirmation email.',
      showAlert: true,
    })
    setTimeout(
      function() {
        this.setState({ showAlert: false })
      }.bind(this),
      5000
    )
    this.myInterval = setInterval(() => {
      this.setState({
        seconds: this.state.seconds - 1,
      })

      if (this.state.seconds === 0) {
        clearInterval(this.myInterval)
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.myInterval)
  }

  render() {
    return (
      <Fragment>
        <p>
          Didn't received the email yet? <br />
          <Button
            variant="link"
            style={{ marginTop: `-4px`, padding: 0 }}
            onClick={() => {
              this.setState({
                seconds: secondsToWait,
              })
              this.componentDidMount()
            }}
            disabled={this.state.seconds === 0 ? false : true}
          >
            Resend
          </Button>
          &nbsp;in {this.state.seconds} sec
        </p>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showAlert}
          autoHideDuration={1000}
        >
          <Alert severity={this.state.alertVariant}>
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
      </Fragment>
    )
  }
}

export default ResendCountdown
