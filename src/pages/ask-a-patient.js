{
  /*
   * ask-a-patient.js
   *
   * Page for Ask A Patient (/ask-a-patient)
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

import React from 'react'
import { Divider } from '@material-ui/core'
import Content from '../components/PostAuth/Layout/content'
import { Form, Col, Row } from 'react-bootstrap'
import SEO from '../components/utils/seo'
import { getUserDetails } from '../components/utils/auth'
import TabSelection from '../components/PostAuth/Form/Ask-A-Patient/tabSelection'
import { navigate } from 'gatsby'

class AskAPatient extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      patientsemail: '',
      emailsubject: '',
    }
    this.handlePatientsEmail = this.handlePatientsEmail.bind(this)
    this.handleSubject = this.handleSubject.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
  }

  componentDidMount() {
    this.setState({
      email: getUserDetails('email'),
    })
    if (getUserDetails('is_patient')) navigate('/home')
  }

  handlePatientsEmail(input) {
    this.setState({
      patientsemail: input.target.value,
    })
  }

  handleSubject(input) {
    this.setState({
      emailsubject: input.target.value,
    })
  }

  handleEmail(input) {
    this.setState({
      email: input.target.value,
    })
  }

  render() {
    return (
      <Content>
        <SEO title="Ask a Patient" />
        <h6
          style={{
            marginTop: `10px`,
            fontWeight: `bold`,
            color: `#505050`,
          }}
        >
          Ask a Patient
        </h6>
        <Divider variant="middle" />
        <br />
        <div className="main-content">
          <div className="main-content__body">
            <Form className="form">
              <Form.Group as={Row} controlId="form__email">
                <Form.Label column sm={2} className="form__label">
                  Patient's Email:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="email"
                    placeholder="Enter Patient's email"
                    className="form__input"
                    onInput={this.handlePatientsEmail}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Patient's Email is required.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="form__subject">
                <Form.Label column sm={2} className="form__label">
                  Subject:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    placeholder="Subject of your email"
                    className="form__input"
                    onInput={this.handleSubject}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid">
                    Patient's Email is required.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="form__from">
                <Form.Label column sm={2} className="form__label">
                  Your Email:
                </Form.Label>
                <Col sm={10}>
                  <span id="form__doctor-email" variant="link">
                    {this.state.email}
                  </span>
                </Col>
              </Form.Group>
              <TabSelection
                patientsemail={this.state.patientsemail}
                emailsubject={this.state.emailsubject}
                doctorsemail={this.state.email}
              />
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}

export default AskAPatient
