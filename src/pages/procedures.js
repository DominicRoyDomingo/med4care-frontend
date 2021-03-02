{
  /*
   * procedures.js
   *
   * Page for Procedures screen (/procedures)
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React from 'react'
import Content from '../components/PostAuth/Layout/content'
import SEO from '../components/utils/seo'
import UnderConstruction from '../components/utils/underContruction'
import { getUserDetails } from '../components/utils/auth'
import { navigate } from 'gatsby'

const pageName = 'Procedures'

class Procedures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (getUserDetails('is_patient')) navigate('/home')
  }

  render() {
    return (
      <Content>
        <SEO title={pageName} />
        <UnderConstruction pageName={pageName} />
      </Content>
    )
  }
}

export default Procedures
