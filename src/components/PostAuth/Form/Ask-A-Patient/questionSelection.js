{
  /*
   * questionSelection.js
   *
   * Auto-complete functionality for searching questions
   * in Ask-A-Patient UI
   *
   * Author: Dominic Domingo
   * Created: 12/19/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Form, InputGroup, Row } from 'react-bootstrap'
import { Grid, Button, TextField } from '@material-ui/core'
import { Alert, Autocomplete } from '@material-ui/lab'
import { FaTimes } from 'react-icons/fa'
import { MdExpandMore } from 'react-icons/md'
import { withSnackbar } from 'notistack'
import { Flip } from 'react-reveal'
import { isValidEmail } from '../../../utils/validations'
import { getUserDetails } from '../../../utils/auth'
import axios from '../../../../presets/axios'
import fetch from 'isomorphic-fetch'
import dateformat from 'dateformat'
import PropTypes from 'prop-types'

const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

const dupQuestionMsg = 'That question already exists.'

const connectParam = '?path=' + process.env.ADMIN_PATH_URL
const patientParam = '?path=' + process.env.PATIENT_PATH_URL

let appBaseURL = process.env.APP_URL
const appURL =
  appBaseURL.slice(appBaseURL.length - 1) === '/'
    ? appBaseURL
    : appBaseURL + '/'

class QuestionSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: new Array(),
      options: new Array(),
      allOptions: new Array(),
      assignedQuestions: new Array(),
      isLoading: true,
      doctor_id: 0,
    }
    this.setQuestions = this.setQuestions.bind(this)
    this.sendQuestions = this.sendQuestions.bind(this)
  }

  refreshAssignedQuestions() {
    fetch(
      appURL +
        'api/auth/admin/questions/assigned' +
        patientParam +
        '&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        this.setState({ assignedQuestions: json.data })
      })
  }

  componentDidMount() {
    this.setState({
      doctor_id: getUserDetails('user_id'),
    })

    this.refreshAssignedQuestions()

    fetch(
      appURL +
        'api/data/questions' +
        connectParam +
        '&lang=en&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        const filteredQuestions = json.question.filter(
          question => question.level === 'primary'
        )

        this.setState(
          {
            isLoading: false,
            options: filteredQuestions,
            allOptions: json.question,
          },
          function() {
            if (this.state.options.length === 0) {
              this.props.enqueueSnackbar(
                'What a bummer! No questions are available.',
                {
                  variant: 'error',
                }
              )
            }
          }
        )
      })
      .catch(() => {
        this.props.enqueueSnackbar(
          'Uh oh... We encountered an issue on our side.',
          {
            variant: 'error',
          }
        )
      })
  }

  setQuestions(selected) {
    let questionExists = false

    if (selected.length != 0) {
      if (this.state.selected.length === 0) {
        this.setState({
          selected: this.state.selected.concat(selected),
        })
      } else {
        this.state.selected.map(question => {
          if (question.id === selected.id) {
            questionExists = true
          }
        })
        questionExists
          ? this.props.enqueueSnackbar(dupQuestionMsg, {
              variant: 'error',
            })
          : this.setState({
              selected: this.state.selected.concat(selected),
            })
      }
    }
  }

  removeQuestion(id) {
    const filtered = this.state.selected.filter(question => question.id != id)
    this.setState({
      selected: filtered,
    })
  }

  async sendQuestions() {
    const patientsemail = this.props.patientsemail
    const emailsubject = this.props.emailsubject
    const doctorsemail = this.props.doctorsemail
    const doctorId = this.state.doctor_id

    this.state.selected.length > 0
      ? patientsemail !== '' && isValidEmail(patientsemail)
        ? emailsubject !== ''
          ? doctorsemail.length !== '' && isValidEmail(doctorsemail)
            ? await fetch(
                appURL +
                  'api/auth/admin/patients' +
                  patientParam +
                  '&api_token=' +
                  getUserDetails('token')
              )
                .then(response => response.json())
                .then(json => {
                  const patientList = json.data.filter(
                    patient =>
                      patient.type.toLowerCase() === 'patient' &&
                      patient.attributes.email.toLowerCase() ===
                        patientsemail.toLowerCase()
                  )

                  if (patientList.length !== 0) {
                    this.state.selected.map(question => {
                      const postUrl =
                        '/auth/admin/questions/assigned/store' + patientParam
                      const requestMethod = 'post'

                      const param = {
                        url: postUrl,
                        method: requestMethod,
                        data: {
                          url: postUrl,
                          method: requestMethod,
                          patient_id: patientList[0].id,
                          doctor_id: doctorId,
                          question_id: Number(question.id),
                          status: 'Open',
                          assign_date: dateformat(new Date(), 'isoDate'),
                          assign_time: dateformat(new Date(), 'isoTime'),
                          last_answered: dateformat(
                            new Date(),
                            'yyyy-mm-dd HH:MM:ss'
                          ),
                          created_at: dateformat(
                            new Date(),
                            'yyyy-mm-dd UTC:HH:MM:ss Z'
                          ),
                          updated_at: dateformat(
                            new Date(),
                            'yyyy-mm-dd UTC:HH:MM:ss Z'
                          ),
                        },
                      }

                      const existsQuestion = this.state.assignedQuestions.filter(
                        assigned =>
                          assigned.attributes.patient_id === patientList.id &&
                          assigned.attributes.doctor_id === doctorId &&
                          assigned.attributes.question_id ===
                            Number(question.id) &&
                          assigned.attributes.status !== 'Closed'
                      )

                      if (existsQuestion.length === 0) {
                        axios(param)
                          .then(response => {
                            switch (response.status) {
                              case 201:
                                this.props.enqueueSnackbar(
                                  'Your Questions were sent to ' +
                                    patientsemail +
                                    '.',
                                  {
                                    variant: 'success',
                                    preventDuplicate: true,
                                  }
                                )

                                this.refreshAssignedQuestions()

                                break
                            }
                          })
                          .catch(() => {
                            this.props.enqueueSnackbar(
                              "We had made a mess, we'll get back to you once we've fixed it.",
                              {
                                variant: 'error',
                                preventDuplicate: true,
                              }
                            )
                          })
                      } else {
                        this.props.enqueueSnackbar(
                          "Some questions were not sent because they're already being answered by our patient.",
                          {
                            variant: 'warning',
                            preventDuplicate: true,
                          }
                        )
                      }
                    })
                  } else {
                    this.props.enqueueSnackbar(
                      "Your patient's email is not in one of our records.",
                      {
                        variant: 'error',
                      }
                    )
                  }
                })
                .catch(() => {
                  this.props.enqueueSnackbar(
                    "We had made a mess, we'll get back to you once we've fixed it.",
                    {
                      variant: 'error',
                    }
                  )
                })
            : this.props.enqueueSnackbar('Your email is not valid.', {
                variant: 'error',
              })
          : this.props.enqueueSnackbar('Email Subject is blank.', {
              variant: 'error',
            })
        : this.props.enqueueSnackbar("Patient's email is not valid.", {
            variant: 'error',
          })
      : this.props.enqueueSnackbar('Please select a question to continue.', {
          variant: 'error',
        })
  }

  addSubQuestion(subQuestion) {
    let subQuery
    this.state.allOptions.forEach(question => {
      if (question.id === subQuestion) subQuery = question.question
    })
    return subQuery
  }

  render() {
    return (
      <Fragment>
        <Form.Group as={Row} className="form__searchbox-question">
          <Form.Label className="form__label">
            Search a question to ask a patient
          </Form.Label>
          <InputGroup sm={10}>
            <Autocomplete
              options={this.state.options}
              loading={this.state.isLoading}
              getOptionLabel={option => option.question}
              style={{ width: `100%`, backgroundColor: `#fff` }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Choose a question"
                  variant="outlined"
                  fullWidth
                />
              )}
              className="form__searchbox-autocomplete"
              onChange={(event, value) => {
                if (value !== null) this.setQuestions(value)
              }}
              clearOnEscape={true}
              popupIcon={<MdExpandMore />}
              noOptionsText="Your search did not match any of our questions."
            />
          </InputGroup>
        </Form.Group>
        <br />
        {this.state.selected.length === 0 ? (
          <Alert variant="outlined" severity="info" elevation={3}>
            <strong>No selected questions, yet.</strong> Search questions using
            this box above.
          </Alert>
        ) : (
          <Fragment>
            <Row>
              <div className="form__selectedquestions">
                <h6 style={{ fontSize: `20px`, marginBottom: `20px` }}>
                  Questions:{' '}
                </h6>
                <ol>
                  {this.state.selected.map(question => (
                    <Flip top key={question.id}>
                      <li key={question.id}>
                        <span className="form__mainquestions">
                          {question.question}
                          <FaTimes
                            className="form__question-icon"
                            onClick={() => {
                              this.removeQuestion(question.id)
                            }}
                          />
                        </span>
                        {question.question_link_id !== null ? (
                          <ol
                            className="form__subquestions"
                            style={{ fontSize: `14px` }}
                          >
                            <strong style={{ fontSize: `14px !important` }}>
                              Linked Question:
                            </strong>
                            <li>
                              {this.addSubQuestion(question.question_link_id)}
                            </li>
                          </ol>
                        ) : (
                          <Fragment>
                            <br />
                            <p
                              style={{
                                padding: `10px 0 0 40px`,
                                color: `#3EB5C7`,
                                fontWeight: `700`,
                              }}
                            >
                              (No linked questions)
                            </p>
                          </Fragment>
                        )}
                      </li>
                    </Flip>
                  ))}
                </ol>
              </div>
            </Row>
          </Fragment>
        )}
        <Grid container style={{ marginTop: `20px` }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              style={{ float: `right` }}
              onClick={this.sendQuestions}
              className="form__button"
            >
              Email Questions
            </Button>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
}

QuestionSelection.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
}

export default withSnackbar(QuestionSelection)
