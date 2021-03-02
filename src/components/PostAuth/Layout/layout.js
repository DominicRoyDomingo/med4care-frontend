{
  /*
   * layout.js
   *
   * As name implies, Layout Component :)
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React, { Fragment } from 'react'
import {
  Grid,
  IconButton,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core'
import { navigate } from 'gatsby'
import { Skeleton } from '@material-ui/lab'
import { SnackbarProvider } from 'notistack'
import { getUserDetails } from '../../utils/auth'
import { Mobile } from '../../utils/mediaQuery'
import { FiX } from 'react-icons/fi'
import MobileDrawer from './mobiledrawer'
import AppBarHeader from './appbarheader'
import Sidenavbar from './sidenavbar'
import './layout.scss'

const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

let link = ''

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8db6d9',
    },
    secondary: {
      main: '#3EB5C7',
    },
  },
})

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false, userAuth: undefined }
  }

  setActiveLink(activeLink) {
    link = activeLink
  }
  setVisible(isVisible) {
    this.setState({ visible: isVisible })
  }

  componentDidMount() {
    this.setState(
      {
        userAuth: localStorage.userAuth,
      },
      () => {
        if (this.state.userAuth === undefined) navigate('/login')
      }
    )
  }

  render() {
    const notistackRef = React.createRef()
    const onClickDismiss = key => () => {
      notistackRef.current.closeSnackbar(key)
    }

    if (this.state.userAuth === undefined) {
      return (
        <Grid style={{ overflow: `hidden` }}>
          <Grid container>
            <Grid item xs>
              <Skeleton
                variant="rect"
                height={95}
                style={{ padding: `16px 100px` }}
              >
                <Skeleton variant="rect" height={60} />
              </Skeleton>
            </Grid>
          </Grid>
          <br />
          <Grid
            container
            spacing={5}
            style={{ padding: `20px`, height: `80vh` }}
          >
            <Grid item xs={7}>
              <Grid style={{ padding: `0 150px` }}>
                <Skeleton variant="rect" height={400} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Skeleton
                variant="rect"
                height={500}
                style={{ padding: `20px 50px` }}
              >
                <Skeleton variant="text" height={100} />
                <br />
                <Skeleton variant="text" />
                <Skeleton variant="rect" height={40} />
                <br />
                <Skeleton variant="text" />
                <Skeleton variant="rect" height={40} />
                <br />
                <Skeleton variant="text" />
                <br />
                <Skeleton variant="rect" height={40} />
              </Skeleton>
            </Grid>

            <Skeleton variant="text" style={{ width: `100%` }} />
          </Grid>
        </Grid>
      )
    } else {
      if (getUserDetails('has_backend_access')) {
        localStorage.removeItem('userAuth')
        location.replace(
          process.env.HAS_BACKEND_ACCESS_URL +
            '?api_token=' +
            getUserDetails('token')
        )
        return <Fragment></Fragment>
      } else {
        return (
          <ThemeProvider theme={theme}>
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
              <div className="layout">
                <Sidenavbar
                  activeLink={link}
                  setActiveLink={this.setActiveLink.bind(this)}
                  isVisible={this.state.visible}
                />
                <main style={{ height: `100%`, width: `100%` }}>
                  <AppBarHeader setVisible={this.setVisible.bind(this)} />
                  {this.props.children}
                </main>
                <Mobile>
                  <MobileDrawer />
                </Mobile>
              </div>
            </SnackbarProvider>
          </ThemeProvider>
        )
      }
    }
  }
}

export default Layout
