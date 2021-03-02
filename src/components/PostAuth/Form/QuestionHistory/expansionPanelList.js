{
  /*
   * expansionPanelList.js
   *
   * Expansion List view
   *
   * Author: Dominic Domingo
   * Created: 03/09/2020
   *
   */
}

import React, { Fragment } from 'react'
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import { Alert, Skeleton } from '@material-ui/lab'
import { MdExpandMore } from 'react-icons/md'
import { Link } from 'gatsby'
import { getUserDetails } from '../../../utils/auth'
import clsx from 'clsx'
import dateformat from 'dateformat'

const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

let appBaseURL = process.env.APP_URL
const appURL =
  appBaseURL.slice(appBaseURL.length - 1) === '/'
    ? appBaseURL
    : appBaseURL + '/'

const patientParam = '?path=' + process.env.PATIENT_PATH_URL

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  heading: {
    color: '#012B58',
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '35%',
    flexShrink: 0,
  },
  secondaryHeading: {
    color: '#012B58',
    fontSize: theme.typography.pxToRem(15),
  },
  panelDetails: {
    backgroundColor: '#f5f5f5',
    paddingTop: theme.spacing(2),
  },
  expandIcon: {
    color: '#012B58',
    backgroundColor: '#8DB6D9',
    borderRadius: '200px',
    padding: 3,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: 'none',
    },
  },
  buttonChoices: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    padding: theme.spacing(1),
    width: '20%',
    borderRadius: 2,
    borderColor: '#2699FB !important',
    color: '#2699FB !important',
    backgroundColor: 'rgba(38, 153, 251, 0.2)',
    '&:hover, &:active': {
      backgroundColor: '#56b3ff',
      color: '#fff',
    },
  },
  yesButton: {
    color: '#fff !important',
    backgroundColor: '#28a745',
    borderColor: '#28A745 !important',
    opacity: 0.5,
    '&:hover, &:active': {
      backgroundColor: '#2dc64e',
      color: '#fff',
      opacity: 0.8,
    },
  },
  noButton: {
    color: '#fff !important',
    backgroundColor: 'rgb(245, 0, 87)',
    borderColor: '#3EB5C7 !important',
    opacity: 0.5,
    '&:hover, &:active': {
      backgroundColor: '#ff025a',
      color: '#fff',
      opacity: 0.8,
    },
  },
  selectedButton: {
    opacity: 1,
    color: '#fff !important',
  },
  questionsContainer: {
    width: '100%',
  },
  textAnswer: {
    marginTop: theme.spacing(2),
    borderRadius: 2,
    fontWeight: 300,
  },
  skelContainer: {
    marginTop: theme.spacing(1),
  },
  statusText: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontWeight: 400,
    fontSize: '0.7rem',
  },
  answeredText: {
    color: 'green',
  },
  reopenText: {
    color: 'orange',
  },
  openText: {
    color: 'gray',
  },
  expansionPanel: {
    backgroundColor: '#8DB6D9',
    boxShadow: '0px 12px 6px -9px rgba(0,0,0,0.1)',
    border: '1px solid #d8d8d8',
    transition: 'all 0.2s ease-in-out',
    color: '#012B58',
    '&:nth-child(even)': {
      backgroundColor: '#769FCA',
    },
    '&:hover': {
      backgroundColor: '#A4C4E3',
    },
  },
}))

export default function ExpansionPanelList() {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [assignedQuestions, setAssignedQuestions] = React.useState(new Array())
  const [storedAnswers, setStoredAnswers] = React.useState(new Array())
  const [questionList, setQuestionList] = React.useState(new Array())
  const [doctorsName, setDoctorsName] = React.useState(new Array())
  const isPatient = getUserDetails('is_patient')

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const getAssignedQuestions = () => {
    fetch(
      appURL +
        'api/auth/admin/questions/assigned' +
        patientParam +
        '&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        if (isPatient) {
          const questionsPerUser = [
            ...new Set(
              json.data.map(questions => questions.attributes.doctor_id)
            ),
          ]

          if (
            json.data.filter(
              question =>
                question.attributes.patient_id === getUserDetails('patient_id')
            ).length > 0
          ) {
            setAssignedQuestions(
              questionsPerUser.map(doctor =>
                json.data.filter(
                  questions =>
                    questions.attributes.patient_id ===
                      getUserDetails('patient_id') &&
                    questions.attributes.doctor_id === doctor
                ).length > 0
                  ? [
                      {
                        doctor_id: doctor,
                        assignedQuestions: json.data.filter(
                          questions =>
                            questions.attributes.doctor_id === doctor &&
                            questions.attributes.patient_id ===
                              getUserDetails('patient_id')
                        ),
                      },
                    ]
                  : new Array()
              )
            )
          }
        } else {
          const questionsPerUser = [
            ...new Set(
              json.data.map(questions => questions.attributes.patient_id)
            ),
          ]

          if (
            json.data.filter(
              question =>
                question.attributes.doctor_id === getUserDetails('user_id')
            ).length > 0
          ) {
            setAssignedQuestions(
              questionsPerUser.map(patient =>
                json.data.filter(
                  questions =>
                    questions.attributes.doctor_id ===
                      getUserDetails('user_id') &&
                    questions.attributes.patient_id === patient
                ).length > 0
                  ? [
                      {
                        patient_id: patient,
                        assignedQuestions: json.data.filter(
                          questions =>
                            questions.attributes.patient_id === patient &&
                            questions.attributes.doctor_id ===
                              getUserDetails('user_id')
                        ),
                      },
                    ]
                  : new Array()
              )
            )
          }
        }

        setLoading(false)
      })
  }

  const getAnsweredQuestions = () => {
    fetch(
      appURL +
        'api/auth/admin/answers' +
        patientParam +
        '&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        json.data.filter(list => list.relationships.assignQuestion === null)
          .length === 0
          ? setStoredAnswers(
              json.data.filter(list =>
                isPatient
                  ? list.relationships.assignQuestion.patient_id ===
                    getUserDetails('patient_id')
                  : list.relationships.assignQuestion.doctor_id ===
                    getUserDetails('user_id')
              )
            )
          : setStoredAnswers(new Array())
      })
  }

  const getQuestionList = () => {
    fetch(
      appURL +
        'api/data/questions?path=' +
        process.env.ADMIN_PATH_URL +
        '&lang=en&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        setQuestionList(json.question)
      })
  }

  const getQuestion = question_id => {
    return questionList
      .filter(question => question.id === question_id)
      .map(question => question.question)[0]
  }

  const getChoices = (question_id, assigned_id) => {
    return questionList
      .filter(question => question.id === question_id)
      .flatMap(question =>
        question.type === 'choices' ? (
          question.choices.flatMap(choice => (
            <Button
              key={choice.choice}
              variant="outlined"
              className={clsx(
                classes.buttonChoices,
                { [classes.yesButton]: choice.choice === 'Yes' },
                { [classes.noButton]: choice.choice === 'No' },
                {
                  [classes.selectedButton]:
                    choice.choice ==
                    storedAnswers
                      .filter(
                        answer =>
                          answer.attributes.question_id === question_id &&
                          answer.attributes.assigned_question_id === assigned_id
                      )
                      .map(choosen => choosen.attributes.answer)[0],
                }
              )}
              disabled={true}
            >
              {choice.choice}
            </Button>
          ))
        ) : (
          <TextField
            key={question.type}
            variant="outlined"
            fullWidth={true}
            disabled={true}
            size="small"
            className={classes.textAnswer}
            value={
              storedAnswers
                .filter(
                  answer =>
                    answer.attributes.question_id === question_id &&
                    answer.attributes.assigned_question_id === assigned_id
                )
                .map(choosen => choosen.attributes.answer)[0] === undefined
                ? '(no answer)'
                : storedAnswers
                    .filter(
                      answer =>
                        answer.attributes.question_id === question_id &&
                        answer.attributes.assigned_question_id === assigned_id
                    )
                    .map(choosen => choosen.attributes.answer)[0]
            }
          />
        )
      )
  }

  const getStatus = assigned_id => {
    const status = assignedQuestions
      .flatMap(assigned =>
        assigned.flatMap(questions => questions.assignedQuestions)
      )
      .filter(item => item.id === assigned_id)[0].attributes.status

    const lastAnswered = dateformat(
      new Date(
        assignedQuestions
          .flatMap(assigned =>
            assigned.flatMap(questions => questions.assignedQuestions)
          )
          .filter(item => item.id === assigned_id)[0]
          .attributes.last_answered.replace(/-/g, '//')
      ),
      'mmm dd, yyyy hh:MM:ss tt'
    ).toString()

    return (
      <p className={classes.statusText}>
        *{' '}
        <strong
          className={clsx(
            { [classes.answeredText]: status === 'Answered' },
            { [classes.openText]: status === 'Open' },
            { [classes.reopenText]: status === 'Reopen' }
          )}
        >
          {status}
        </strong>{' '}
        on {lastAnswered}
      </p>
    )
  }

  const getDoctorsName = () => {
    if (getUserDetails('token') !== undefined)
      fetch(
        appURL +
          'api/auth/doctor?path=' +
          process.env.AUTH_PATH +
          '&token=' +
          getUserDetails('token')
      )
        .then(response => response.json())
        .then(json => {
          if (json.error === undefined) setDoctorsName(json)
        })
  }

  React.useEffect(() => {
    getDoctorsName()
    getAssignedQuestions()
    getAnsweredQuestions()
    getQuestionList()
  }, [])

  return (
    <div className={classes.root}>
      {loading ? (
        <Fragment>
          <Skeleton
            variant="rect"
            height={50}
            animation="wave"
            className={classes.skelContainer}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={3}
                style={{ marginTop: `15px`, paddingLeft: `20px` }}
              >
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={8}>
                <Skeleton variant="text" style={{ marginTop: `15px` }} />
              </Grid>
              <Grid item xs={1} style={{ marginTop: `8px` }}>
                <Skeleton
                  variant="circle"
                  width={35}
                  height={35}
                  className={classes.skelIcon}
                />
              </Grid>
            </Grid>
          </Skeleton>
          <Skeleton
            variant="rect"
            height={50}
            animation="wave"
            className={classes.skelContainer}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={3}
                style={{ marginTop: `15px`, paddingLeft: `20px` }}
              >
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={8}>
                <Skeleton variant="text" style={{ marginTop: `15px` }} />
              </Grid>
              <Grid item xs={1} style={{ marginTop: `8px` }}>
                <Skeleton
                  variant="circle"
                  width={35}
                  height={35}
                  className={classes.skelIcon}
                />
              </Grid>
            </Grid>
          </Skeleton>
          <Skeleton
            variant="rect"
            height={50}
            animation="wave"
            className={classes.skelContainer}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={3}
                style={{ marginTop: `15px`, paddingLeft: `20px` }}
              >
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={8}>
                <Skeleton variant="text" style={{ marginTop: `15px` }} />
              </Grid>
              <Grid item xs={1} style={{ marginTop: `8px` }}>
                <Skeleton
                  variant="circle"
                  width={35}
                  height={35}
                  className={classes.skelIcon}
                />
              </Grid>
            </Grid>
          </Skeleton>
          <Skeleton
            variant="rect"
            height={50}
            animation="wave"
            className={classes.skelContainer}
          >
            <Grid container spacing={2}>
              <Grid
                item
                xs={3}
                style={{ marginTop: `15px`, paddingLeft: `20px` }}
              >
                <Skeleton variant="text" />
              </Grid>
              <Grid item xs={8}>
                <Skeleton variant="text" style={{ marginTop: `15px` }} />
              </Grid>
              <Grid item xs={1} style={{ marginTop: `8px` }}>
                <Skeleton
                  variant="circle"
                  width={35}
                  height={35}
                  className={classes.skelIcon}
                />
              </Grid>
            </Grid>
          </Skeleton>
        </Fragment>
      ) : assignedQuestions.length > 0 ? (
        assignedQuestions.flatMap(assigned =>
          assigned.map(assigned => (
            <ExpansionPanel
              TransitionProps={{ unmountOnExit: true }}
              expanded={
                expanded ===
                (isPatient ? assigned.doctor_id : assigned.patient_id)
              }
              onChange={handleChange(
                isPatient ? assigned.doctor_id : assigned.patient_id
              )}
              key={isPatient ? assigned.doctor_id : assigned.patient_id}
              className={classes.expansionPanel}
            >
              <ExpansionPanelSummary
                expandIcon={<MdExpandMore className={classes.expandIcon} />}
              >
                <Typography className={classes.heading}>
                  {isPatient ? 'Questions by Doctor' : 'Questions for Patient'}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <strong>
                    {isPatient
                      ? doctorsName.filter(
                          doctor => doctor.id === assigned.doctor_id
                        )[0] !== undefined
                        ? doctorsName.filter(
                            doctor => doctor.id === assigned.doctor_id
                          )[0].first_name +
                          ' ' +
                          doctorsName.filter(
                            doctor => doctor.id === assigned.doctor_id
                          )[0].last_name
                        : null
                      : assigned.assignedQuestions.map(
                          question =>
                            question.relationships.patient.first_name +
                            ' ' +
                            question.relationships.patient.sur_name
                        )[0]}
                  </strong>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.panelDetails}>
                <ol className={classes.questionsContainer}>
                  {assigned.assignedQuestions.map(assigned => (
                    <li key={assigned.id}>
                      {getQuestion(assigned.attributes.question_id)}
                      <br />
                      {getChoices(assigned.attributes.question_id, assigned.id)}
                      <br />
                      {getStatus(assigned.id)}
                    </li>
                  ))}
                </ol>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))
        )
      ) : (
        <Alert variant="outlined" severity="info" elevation={3}>
          <p>
            {!isPatient ? (
              <Fragment>
                <strong>Let's set things rolling!</strong> It appears that we
                haven't had any questions sent yet to any patients. <br />
                <br />
                Use{' '}
                <Link to="/ask-a-patient" className="alert__link">
                  Ask a Patient
                </Link>{' '}
                to get started.
              </Fragment>
            ) : (
              <Fragment>
                <strong>Let's set things rolling!</strong> It appears that we
                haven't had any questions sent yet by any doctors. <br />
              </Fragment>
            )}
          </p>
        </Alert>
      )}
    </div>
  )
}
