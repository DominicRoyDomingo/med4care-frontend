{
  /*
   * expire.js
   *
   * Expire session then redirect to login page.
   *
   * Author: Dominic Domingo
   * Created: 02/15/2020
   *
   */
}

import React from 'react'
import { Grid, Snackbar } from '@material-ui/core'
import { Skeleton, Alert } from '@material-ui/lab'
import { logout } from '../components/utils/auth'

class Expire extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    logout()
  }

  render() {
    return (
      <Grid style={{ overflow: `hidden` }}>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={true}
        >
          <Alert severity="error" variant="filled">
            <span>
              As part of our security policy, we are forcing your account to
              re-login.
            </span>
          </Alert>
        </Snackbar>
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
        <Grid container spacing={5} style={{ padding: `20px`, height: `80vh` }}>
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
  }
}

export default Expire
