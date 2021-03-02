{
  /*
   * 404.js
   *
   * Page for error 404 (page not found)
   *
   * Author: Dominic Domingo
   * Created: 11/08/2019
   *
   */
}

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../components/PreAuth/Layout/layout'
import SEO from '../components/utils/seo'
import { Grid } from '@material-ui/core'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import { MdChevronLeft } from 'react-icons/md'
import { FiChevronsLeft } from 'react-icons/fi'

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "404.jpg" }) {
        childImageSharp {
          fluid(quality: 100, maxWidth: 500) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Img fluid={data.placeholderImage.childImageSharp.fluid} alt="404-img" />
  )
}

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6} style={{ textAlign: `right`, padding: `2%` }}>
        <h1>
          <span style={{ color: `#3EB5C7`, fontSize: `0.8em` }}>(404)</span> NOT
          FOUND
        </h1>
        <p>
          "For the Son of Man has come to seek and to save that which was lost."
        </p>
        <p style={{ textAligh: `right`, fontStyle: `oblique` }}>Luke 19:10</p>
        <br />
        <br />
        <AniLink fade to="/">
          <FiChevronsLeft /> Go back to main page
        </AniLink>
        <br />
        <br />
        <AniLink fade to="/login">
          <MdChevronLeft /> Go back to login page
        </AniLink>
      </Grid>
      <Grid item xs={12} sm={4} style={{ padding: `2%` }}>
        <Image />
      </Grid>
    </Grid>
  </Layout>
)

export default NotFoundPage
