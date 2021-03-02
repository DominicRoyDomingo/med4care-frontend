{
  /*
   * header.js
   *
   * As name implies, Header Component :)
   * primarily used by pre-authenticated Forms
   * i.e. Log In, Sign Up, Forgot Password, etc.
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React from 'react'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import logo from '../../../images/logo-white.png'
import { Grid } from '@material-ui/core'
import { Fade } from 'react-reveal'

const Header = ({ message, button, link }) => (
  <Fade top>
    <header>
      <Grid
        container
        style={{
          background: `#8DB6D9`,
          paddingBottom: `10px`,
        }}
      >
        <Grid item xs={1}></Grid>
        <Grid
          item
          xs
          style={{
            marginTop: `4vh`,
          }}
        >
          <Fade top>
            <AniLink cover direction="up" duration={1.5} bg="#fff" to="/">
              <img
                alt="logo"
                className="header__logo"
                src={logo}
                style={{
                  height: `7vh`,
                }}
              />
            </AniLink>
          </Fade>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid
          item
          xs
          style={{
            margin: `4.5vh 0 auto 0`,
            fontWeight: `500`,
            color: `#012b58`,
            fontSize: `0.9rem`,
            textAlign: `right`,
          }}
        >
          <Fade top>
            <Grid container>
              <Grid item xs style={{ margin: `auto` }}>
                <span className="header__title">{message}</span>
              </Grid>
              {{ button }.button !== undefined ? (
                <AniLink
                  cover
                  direction="up"
                  duration={1.5}
                  bg="#fff"
                  to={link}
                  style={{
                    fontWeight: `600`,
                    textDecoration: `none`,
                    textTransform: `uppercase`,
                    backgroundColor: `#fff`,
                    color: `#8DB6D9`,
                    borderRadius: 2,
                    border: 0,
                    padding: `1.6vh 30px`,
                    marginLeft: `5%`,
                  }}
                >
                  {button}
                </AniLink>
              ) : (
                ''
              )}
            </Grid>
          </Fade>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </header>
  </Fade>
)

export default Header
