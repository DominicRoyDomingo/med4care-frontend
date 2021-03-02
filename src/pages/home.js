{
  /*
   * home.js
   *
   * Page for Landing Page after post-authentication (/home)
   *
   * Author: Dominic Domingo
   * Created: 12/12/2019
   *
   */
}

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import SEO from '../components/utils/seo'
import Content from '../components/PostAuth/Layout/content'
import { getUserDetails } from '../components/utils/auth'
import { Row, Col } from 'react-bootstrap'
import { Desktop, Mobile, Tablet } from '../components/utils/mediaQuery'

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

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
    }
  }

  componentDidMount() {
    this.setState({
      name: getUserDetails('name'),
    })
  }

  render() {
    return (
      <Content>
        <SEO title="Home" />
        <Desktop>
          <Row>
            <Col sm={6}>
              <div id="home__welcome-message">
                <h2>
                  Welcome back, <strong>{this.state.name}</strong>!
                </h2>
                <br />
                <h5>It is nice to see you! Click a link to begin...</h5>
              </div>
            </Col>
            <Col sm={6}>
              <div id="home__welcome-image">
                <Image />
              </div>
            </Col>
          </Row>
        </Desktop>
        <Tablet>
          <Row>
            <Col xs={4}>
              <div id="home__welcome-message">
                <h2>
                  Welcome back, <strong>{this.state.name}</strong>!
                </h2>
                <br />
                <h5>It is nice to see you! Click a link to begin...</h5>
              </div>
            </Col>
            <Col xs={8}>
              <div id="home__welcome-image-mini">
                <Image />
              </div>
            </Col>
          </Row>
        </Tablet>
        <Mobile>
          <Row>
            <Col sm={6}>
              <div id="home__welcome-message-mini">
                <h2>
                  Welcome back, <strong>{this.state.name}</strong>!
                </h2>
                <br />
                <h5>It is nice to see you! Click a link to begin...</h5>
              </div>
            </Col>
            <Col sm={6}>
              <div id="home__welcome-image-mini">
                <Image />
              </div>
            </Col>
          </Row>
        </Mobile>
      </Content>
    )
  }
}

export default Home
