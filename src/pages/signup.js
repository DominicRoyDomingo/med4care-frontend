{
  /*
   * signup.js
   *
   * Page for Sign Up screen (/signup)
   *
   * Author: Dominic Domingo
   * Created: 11/14/2019
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
      placeholderImage: file(relativePath: { eq: "signup.png" }) {
        childImageSharp {
          fluid(quality: 100, maxWidth: 500) {
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
      alt="signup-img"
    />
  )
}

const loginMsg = 'Already signed up?'

const Signup = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Fragment>
      <Spinner visible={loading} />
      <Layout
        message={loginMsg}
        button={'Log in'}
        link={'/login/'}
        style={{ overflow: `hidden` }}
      >
        <SEO title="Sign Up" />
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
                <h5 style={{ fontWeight: `600` }}>SIGN UP</h5>
                <FormContainer
                  message={loginMsg}
                  link={'/login/'}
                  linkName={'Log In'}
                  showForgot={false}
                  button={'SIGN UP'}
                  forgot={false}
                  signup={true}
                />
              </Fade>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </Fragment>
  )
}

export default Signup
