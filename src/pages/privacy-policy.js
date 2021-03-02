{
  /*
   * privacy-policy.js
   *
   * Page for Privacy Policy screen (/privacy-policy)
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

const pageName = 'Privacy Policy'

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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

export default PrivacyPolicy
