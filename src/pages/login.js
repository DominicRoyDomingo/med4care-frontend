{
  /*
   * login.js
   *
   * Page for Login (/login)
   *
   * Author: Dominic Domingo
   * Created: 11/14/2019
   *
   */
}

import React, { Fragment, useState, useEffect } from 'react'
import { useStaticQuery, graphql, navigate } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../components/PreAuth/Layout/layout'
import SEO from '../components/utils/seo'
import FormContainer from '../components/PreAuth/Form/formContainer'
import faker from 'faker'
import { Skeleton } from '@material-ui/lab'
import { Grid, Card } from '@material-ui/core'
import { Fade } from 'react-reveal'
import Spinner from '../components/utils/spinner'

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "login.png" }) {
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
      alt="login-img"
    />
  )
}

const signupMsg = 'No account yet?'

const Login = () => {
  const [userAuth, setUserAuth] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUserAuth(localStorage.userAuth)
    setLoading(false)
  }, [])

  if (userAuth !== undefined) {
    navigate('/home')

    return (
      <Grid container spacing={2} style={{ overflow: `hidden` }}>
        <Grid item xs={2}>
          <Skeleton variant="rect" height={1000} style={{ padding: `16px` }} />
        </Grid>
        <Grid item xs={10} style={{ padding: `20px` }}>
          <Skeleton
            variant="rect"
            height={77}
            style={{ margin: `10px 10px 10px 0`, borderRadius: `4px` }}
          />
          <Skeleton
            variant="rect"
            height={630}
            style={{
              padding: `16px`,
              marginRight: `10px`,
              borderRadius: `5px`,
            }}
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <Fragment>
      <Spinner visible={loading} />
      <Layout
        message={signupMsg}
        button={'Sign up'}
        link={'/signup/'}
        style={{ overflow: `hidden` }}
      >
        <SEO title="Log In" />
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
                  LOG IN
                </h5>
                <FormContainer
                  message={signupMsg}
                  link={'/signup/'}
                  linkName={'Sign Up'}
                  showForgot={true}
                  button={'LOG IN'}
                  forgot={false}
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

export default Login
