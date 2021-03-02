{
  /*
   * index.js
   *
   * Page for Landing Page (/)
   *
   * Author: Dominic Domingo
   * Created: 11/14/2019
   *
   */
}

import React, { Fragment } from 'react'
import SEO from '../components/utils/seo'
import { StaticQuery, graphql } from 'gatsby'
import 'bootstrap/dist/css/bootstrap.min.css'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import './index.scss'
import logo from '../images/logo-white.png'
import { AiOutlineCopyright } from 'react-icons/ai'
import { FaSignature } from 'react-icons/fa'
import { IoMdHeartEmpty } from 'react-icons/io'
import pkgjson from '../../package.json'
import Spinner from '../components/utils/spinner'
import { Fade } from 'react-reveal'
import { Button, Grid } from '@material-ui/core'
import BackgroundImage from 'gatsby-background-image'
import styled from 'styled-components'

const date = new Date()
const year = date.getFullYear()

const BackgroundSection = ({ className }) => (
  <StaticQuery
    query={graphql`
      query {
        desktop: file(relativePath: { eq: "index.jpg" }) {
          childImageSharp {
            fluid(quality: 90, maxWidth: 1920) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    `}
    render={data => {
      const imageData = [
        data.desktop.childImageSharp.fluid,
        `linear-gradient(
        180deg,
        rgba(17, 144, 181, 0.6) 0%,
        rgba(2, 44, 89, 0.6) 100%
        )`,
      ].reverse()

      return (
        <BackgroundImage
          Tag="section"
          className={className}
          fluid={imageData}
          backgroundColor={`#1190b5`}
        ></BackgroundImage>
      )
    }}
  />
)

const StyledBackgroundSection = styled(BackgroundSection)`
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  -webkit-filter: blur(5px);
  filter: blur(5px);
  transition: all 0.5s ease !important;
  height: 100vh;
  width: 70%;
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -o-transform: scale(1.1);
  transform: scale(1.1);
  @media only screen and (max-width: 1199px) {
    width: 80%;
  }
`

export default class IndexPage extends React.Component {
  constructor() {
    super()
    this.state = {
      isLoaderVisible: true,
    }
  }

  componentDidMount() {
    setTimeout(
      this.setState({
        isLoaderVisible: false,
      }),
      10000
    )
  }

  render() {
    return (
      <Fragment>
        <SEO title="Home" />
        <Spinner visible={this.state.isLoaderVisible} />
        <main className="index__page" style={{ backgroundColor: `#3C3324` }}>
          <StyledBackgroundSection />
          <Fade top>
            <img className="index__page-logo" src={logo} alt="logo" />
          </Fade>
          <Grid container className="index__page-content">
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="baseline"
              className="index__page-content-links"
            >
              <Grid item>
                <AniLink
                  cover
                  direction="up"
                  duration={1.5}
                  bg="#fff"
                  to="/login"
                >
                  <Button
                    variant="outlined"
                    className="index__page-main-link"
                    id="index__page-login-btn"
                  >
                    <IoMdHeartEmpty
                      style={{ margin: '10px 5px' }}
                      className="button__icon"
                    />
                    <span className="button__name">Existing User?</span>
                  </Button>
                </AniLink>
              </Grid>
              <Grid item>
                <AniLink
                  cover
                  direction="up"
                  duration={1.5}
                  bg="#fff"
                  to="/signup"
                >
                  <Button
                    className="index__page-main-link"
                    id="index__page-signup-btn"
                  >
                    <FaSignature
                      style={{ margin: 10 }}
                      className="button__icon"
                    />
                    <span className="button__name">Sign Up Now!</span>
                  </Button>
                </AniLink>
              </Grid>
            </Grid>
            <Grid container className="index__page-tagline">
              <Grid item xs={12}>
                <Fade top>
                  <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscingelit. Ut
                    sit amet facilisis neque, a dictum lacus."
                  </p>
                  <Fade top>
                    <h1 className="index__page-name">
                      MED<span style={{ color: `#1090B5` }}>4</span>SURGERY
                    </h1>
                  </Fade>
                </Fade>
              </Grid>
            </Grid>
          </Grid>
          <Fade top>
            <div className="index__page-footer">
              <p
                style={{
                  float: `left`,
                }}
              >
                <AiOutlineCopyright />
                &nbsp;{year}
              </p>
              <p style={{ float: `right` }}>
                Medical Software
                <span className="index__page-footer-ver">
                  {' '}
                  v{pkgjson.version}
                </span>
              </p>
            </div>
          </Fade>
        </main>
      </Fragment>
    )
  }
}
