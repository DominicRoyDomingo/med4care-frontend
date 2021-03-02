{
  /*
   * questionHistoryList.js
   *
   * Component for list view in Question History
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React, { Fragment } from 'react'
import Img from 'gatsby-image'
import { Grid } from '@material-ui/core'
import { useStaticQuery, graphql } from 'gatsby'
import { getUserDetails } from '../../../utils/auth'
import ExpansionPanelList from './expansionPanelList'

const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

const Image = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "nurse-med.png" }) {
        childImageSharp {
          fluid(quality: 100, maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Img fluid={data.placeholderImage.childImageSharp.fluid} alt="nurse-med" />
  )
}

class QuestionHistoryList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: null,
      isPatient: false,
    }
  }

  componentDidMount() {
    this.setState({
      firstName: getUserDetails('first_name'),
      isPatient: getUserDetails('is_patient'),
    })
  }

  render() {
    return (
      <Fragment>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={8} className="history__list">
            <ExpansionPanelList />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            style={{
              marginTop: `20px`,
              borderLeft: `1px solid #e8e8e8`,
              position: `sticky`,
              top: 0,
              maxHeight: `600px`,
            }}
          >
            <Image />
            <h6
              style={{
                textAlign: `center`,
                marginTop: `20px`,
                fontWeight: `300`,
                fontSize: `1.12em`,
              }}
            >
              Hey <strong>{this.state.firstName}</strong>, you can see your
              historical data about questionnaires here. Feel free to browse
              them.
            </h6>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

export default QuestionHistoryList
