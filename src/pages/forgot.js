{
  /*
   * forgot.js
   *
   * Page for Forgot Password (/forgot)
   *
   * Author: Dominic Domingo
   * Created: 11/19/2019
   *
   */
}

import React, { Fragment, useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../components/PreAuth/Layout/layout'
import SEO from '../components/utils/seo'
import FormContainer from '../components/PreAuth/Form/formContainer'
import { Grid, Card } from '@material-ui/core'
import faker from 'faker'
import { Fade } from 'react-reveal'
import Spinner from '../components/utils/spinner'

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "login.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Img
      fluid={data.placeholderImage.childImageSharp.fluid}
      className="pre-auth__image"
      alt="forgot-password-img"
    />
  )
}

const signupMsg = 'No account yet?'

const Forgot = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Fragment>
      <Spinner visible={loading} />
      <Layout
        message={signupMsg}
        button={'Sign up'}
        link={'/signup/'}
        style={{ overflow: `hidden` }}
      >
        <SEO title="Forgot Password" />
        <Grid container>
          <Grid item xs={12} sm={6} className="form__image-container">
            <Grid item xs className="form__image">
              <Fade top>
                <Fade top>
                  <Image />
                </Fade>
                <Fade top>
                  <p
                    style={{
                      textAlign: `center`,
                      marginTop: `20px`,
                      color: `#707070`,
                    }}
                  >
                    {faker.lorem.sentences(2)}
                  </p>
                </Fade>
              </Fade>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} className="form__container-wrapper">
            <Card className="form__container" elevation={4}>
              <Fade top>
                <h5
                  style={{
                    fontWeight: `600`,
                  }}
                >
                  FORGOT PASSWORD
                </h5>
                <span
                  style={{
                    fontWeight: `300`,
                    fontSize: `0.90em`,
                  }}
                >
                  <p>It happens to us too, so we do understand.</p>
                  <p>
                    To reset your password, please enter your registered email.
                    Then follow the instructions that we will be sending to you.
                  </p>
                </span>
                <FormContainer
                  message={signupMsg}
                  link={'/signup/'}
                  linkName={'Sign Up'}
                  showForgot={false}
                  button={'RESET PASSWORD'}
                  forgot={true}
                  signup={false}
                />
              </Fade>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </Fragment>
  )
}

export default Forgot
