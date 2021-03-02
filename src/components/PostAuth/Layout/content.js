{
  /*
   * content.js
   *
   * Content component for layouting post-authenticated screens
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import { navigate } from 'gatsby'
import { Fade } from 'react-reveal'
import { isLoggedIn, getUserDetails } from '../../utils/auth'
import Spinner from '../../utils/spinner'
import ToastNotification from '../../utils/toastNotification'
import Layout from './layout'
import IdleTimer from 'react-idle-timer'
import PropTypes from 'prop-types'

export default class Content extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaderVisible: true,
      alertVariant: '',
      alertHeading: '',
      alertMessage: '',
      showAlert: false,
      expires_in: 0,
    }
    this.idleTimer = null
    this.onIdle = this._onIdle.bind(this)
  }

  componentDidMount() {
    isLoggedIn()
    this.setState({
      isLoaderVisible: false,
      expires_in: getUserDetails('expires_in'),
    })
  }

  handleHideToast() {
    this.setState({
      showAlert: !this.state.showAlert,
    })
  }

  render() {
    return (
      <Fragment>
        <ToastNotification
          variant={this.state.alertVariant}
          heading={this.state.alertHeading}
          message={this.state.alertMessage}
          show={this.state.showAlert}
          handleHideToast={this.handleHideToast.bind(this)}
        />
        <IdleTimer
          ref={ref => {
            this.idleTimer = ref
          }}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={1000 * 3600}
        />
        <Fragment>
          <Spinner visible={this.state.isLoaderVisible} />
          <Layout>
            <div className="content">
              <Row className="content__body">
                <Col>
                  <Fade>{this.props.children}</Fade>
                </Col>
              </Row>
            </div>
          </Layout>
        </Fragment>
      </Fragment>
    )
  }

  _onIdle(e) {
    console.debug('idle', e)

    setTimeout(
      function() {
        navigate('/login')
        this.setState({ showAlert: false })
      }.bind(this),
      5000
    )
  }
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
}
