{
  /*
   * underConstruction.js
   *
   * Component screen for showing Under Construction message
   *
   * Author: Dominic Domingo
   * Created: 01/03/2020
   *
   */
}

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Grid } from '@material-ui/core'

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "under-construction.jpg" }) {
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
      className="underconstruction__img"
      alt="underconstruction-img"
    />
  )
}

export default class UnderContruction extends React.Component {
  render() {
    return (
      <div className="underconstruction__container">
        <Grid container spacing={6}>
          <Grid item xs>
            <Image />
          </Grid>
          <Grid item xs>
            <h6
              className="underconstruction__page"
              style={{ marginLeft: `2%` }}
            >
              <span className="underconstruction__page-name">
                {this.props.pageName}
              </span>{' '}
              is still under construction.
            </h6>
            <br />
            <p style={{ margin: `0 10%` }}>
              “In all our searching, the only thing we've found that makes the
              emptiness bearable is each other.”
            </p>
            <p
              className="underconstruction__quote"
              style={{ margin: `5% 10%` }}
            >
              &ndash; Carl Sagan
            </p>
          </Grid>
        </Grid>
      </div>
    )
  }
}
