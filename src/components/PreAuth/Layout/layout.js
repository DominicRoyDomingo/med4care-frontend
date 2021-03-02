{
  /*
   * layout.js
   *
   * As name implies, Layout Component :)
   * primarily used by pre-authenticated Forms
   * i.e. Log In, Sign Up, Forgot Password, etc.
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Header from './header'
import './layout.scss'
import pkgjson from '../../../../package.json'
import { AiOutlineCopyright } from 'react-icons/ai'
import { Grid, IconButton } from '@material-ui/core'
import { SnackbarProvider } from 'notistack'
import { FiX } from 'react-icons/fi'

const date = new Date()
const year = date.getFullYear()

const Layout = ({ children, message, button, link }) => {
  const notistackRef = React.createRef()
  const onClickDismiss = key => () => {
    notistackRef.current.closeSnackbar(key)
  }
  return (
    <Fragment>
      <SnackbarProvider
        classes={{
          variantSuccess: 'success__snackbar',
          variantError: 'error__snackbar',
          variantWarning: 'warning__snackbar',
          variantInfo: 'info__snackbar',
        }}
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={3000}
        ref={notistackRef}
        action={key => (
          <IconButton
            onClick={onClickDismiss(key)}
            style={{ color: `#012b58`, opacity: 0.6 }}
          >
            <FiX />
          </IconButton>
        )}
      >
        <div className="layout__container">
          <Header message={message} button={button} link={link} />
          <Grid className="layout__preauth_container">{children}</Grid>
          <Grid container className="layout__footer-container">
            <Grid item xs className="layout__footer-copyright">
              <AiOutlineCopyright />
              &nbsp;{year}
            </Grid>
            <Grid item xs className="layout__footer-appname">
              <span style={{ color: `#e9e9e9` }}>Medical Software</span>{' '}
              {pkgjson.version}
            </Grid>
          </Grid>
        </div>
      </SnackbarProvider>
    </Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
