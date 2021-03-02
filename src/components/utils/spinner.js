{
  /*
   * spinner.js
   *
   * Spinner component for loading screens
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React from 'react'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

class Spinner extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Loader
        visible={this.props.visible}
        type="TailSpin"
        color="#00BFFF"
        height={150}
        width={150}
        style={{
          position: `absolute`,
          backgroundColor: `#000`,
          opacity: `0.8`,
          zIndex: `9999`,
          width: `100%`,
          height: `100%`,
          padding: `20% 45%`,
          transition: `0.3s ease all`,
          backdropFilter: `blur(4px)`,
          webKitbackdropFilter: `blur(4px)`,
        }}
      />
    )
  }
}

export default Spinner
