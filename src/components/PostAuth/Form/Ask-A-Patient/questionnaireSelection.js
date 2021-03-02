{
  /*
   * questionnaireSelection.js
   *
   * Questionnaires selection view for
   * Ask-a-Patient screen
   *
   * Author: Dominic Domingo
   * Created: 01/14/2020
   *
   */
}

import React, { Fragment } from 'react'
import {
  makeStyles,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Button,
  IconButton,
  Collapse,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
} from '@material-ui/core'
import { Skeleton, Alert } from '@material-ui/lab'
import { MdExpandMore } from 'react-icons/md'
import { IoIosContract, IoIosExpand } from 'react-icons/io'
import { useSnackbar } from 'notistack'
import { isValidEmail } from '../../../utils/validations'
import { getUserDetails } from '../../../utils/auth'
import axios from '../../../../presets/axios'
import fetch from 'isomorphic-fetch'
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
    padding: 16,
  },
  fieldsetContainer: {
    width: '100%',
  },
  skelContainer: {
    borderRadius: '4px',
    margin: '0 auto',
  },
  headerContainer: {
    padding: '16px',
  },
  alignLeft: {
    float: 'left',
  },
  alignRight: {
    float: 'right',
    padding: 0,
  },
  skelBody: {
    padding: 10,
  },
  card: {
    color: '#555',
    minWidth: 320,
    maxWidth: 320,
    width: '100%',
    backgroundColor: '#f0f0f0',
    margin: `0 auto`,
  },
  cardContent: {
    minWidth: 300,
    maxWidth: 300,
    minHeight: 200,
    maxHeight: 200,
    padding: 0,
    overflow: 'auto',
    color: '#565656',
  },
  label: {
    fontWeight: 'bold',
    fontFamily: 'Open Sans Condensed',
    fontSize: '16px',
    color: '#212529',
    textAlign: 'left',
    marginBottom: 15,
    float: 'left',
  },
  media: {
    height: 0,
    paddingTop: '60%',
    boxShadow: `0px 0px 5px 0px rgba(0,0,0,0.75)`,
  },
  collapse: {
    fontSize: '14px',
    float: 'right',
  },
  expandButton: {
    float: 'right',
    transition: 'all 0.5s ease-in-out',
    marginBottom: 20,
  },
  expandButtonIcon: {
    marginLeft: 20,
    transition: 'all 0.5s ease-in-out',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: '0',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    backgroundColor: '#f8f8f8',
    borderRadius: 200,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.15)',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  questItem: {
    padding: '2vh',
    border: '1px solid #e8e8e8',
    borderRadius: 2,
  },
  selectedItem: {
    background: 'rgba(141, 182, 217, 0.3)',
    transition: 'all 0.5s ease-in-out',
    padding: '2vh',
    border: '1px solid #8db6d9',
    borderRadius: 2,
  },
  icon: {
    borderRadius: '50%',
    width: 25,
    height: 25,
    boxShadow:
      'inset 0 0 0 2px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#012B58',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 25,
      height: 25,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#012B58',
    },
  },
  submitButtonContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: '24px',
  },
  subHeader: {
    fontSize: '14px',
    fontWeight: '300',
    color: '#999',
    fontFamily: 'Open Sans Condensed',
    textAlign: 'right',
  },
  expansionPanel: {
    background: 'rgba(255,255,255,0)',
    border: 'none',
    boxShadow: 'none',
  },
  summaryPanel: {
    minHeight: 50,
    maxHeight: 50,
  },
  selectedCard: {
    backgroundColor: '#e0e0e0',
    transition: 'all 0.5s ease-in-out',
  },
}))

export default function QuestionnaireSelection(props) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(new Array())
  const [expandedAll, setExpandedAll] = React.useState(false)
  const [questionnaires, setQuestionnaires] = React.useState(new Array())
  const [questions, setQuestions] = React.useState(new Array())
  const [assignedQuestions, setAssignedQuestions] = React.useState(new Array())
  const [doctorId, setDoctorId] = React.useState(null)
  const [radioValue, setRadioValue] = React.useState(null)
  const [skeletonVisible, setSkeletonVisible] = React.useState(true)

  const handleExpandAll = () => {
    if (!expandedAll) setExpanded(false)

    setExpandedAll(!expandedAll)
  }

  const handleExpansionChange = panel => (event, isExpanded) => {
    setExpandedAll(false)
    setExpanded(isExpanded ? panel : false)
  }

  const handleChange = event => {
    setRadioValue(event.target.value)
  }

  const refreshAssignedQuestions = () => {
    fetch(
      appURL +
        'api/auth/admin/questions/assigned' +
        patientParam +
        '&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        setAssignedQuestions(json.data)
      })
  }

  React.useEffect(() => {
    refreshAssignedQuestions()

    fetch(
      appURL +
        'api/data/questionnaires?path=' +
        process.env.ADMIN_PATH_URL +
        '&lang=en&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        setQuestionnaires(json.questionnaire)
        setQuestions(json.question)
        setSkeletonVisible(false)
      })

    setDoctorId(getUserDetails('user_id'))
  }, [])

  const ButtonProvider = props => {
    const { enqueueSnackbar } = useSnackbar()

    const handleClick = () => {
      if (!isValidEmail(props.patientsemail)) {
        enqueueSnackbar("Invalid Patient's Email entered.", {
          variant: 'error',
        })
      } else if (props.emailsubject === '') {
        enqueueSnackbar('Email Subject is blank.', {
          variant: 'error',
        })
      } else if (!isValidEmail(props.doctorsemail)) {
        enqueueSnackbar('Your email is invalid.', {
          variant: 'error',
        })
      } else if (radioValue === null) {
        enqueueSnackbar('Select a questionnaire to continue.', {
          variant: 'error',
        })
      } else {
        fetch(
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
                  props.patientsemail.toLowerCase()
            )

            const selectedList = questionnaires.filter(
              questionnaire => questionnaire.id == radioValue
            )

            if (patientList.length !== 0) {
              selectedList.map(questionnaire => {
                questionnaire.questions.map(question_id => {
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
                      question_id: Number(question_id),
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

                  const existsQuestion = assignedQuestions.filter(
                    question =>
                      question.attributes.patient_id === patientList[0].id &&
                      question.attributes.doctor_id === doctorId &&
                      question.attributes.question_id === Number(question_id) &&
                      question.attributes.status !== 'Closed'
                  )

                  if (existsQuestion.length === 0) {
                    axios(param)
                      .then(response => {
                        switch (response.status) {
                          case 201:
                            enqueueSnackbar(
                              'Your Questions were sent to ' +
                                props.patientsemail +
                                '.',
                              {
                                variant: 'success',
                                preventDuplicate: true,
                              }
                            )

                            refreshAssignedQuestions()

                            break
                        }
                      })
                      .catch(() => {
                        enqueueSnackbar(
                          "We had made a mess, we'll get back to you once we've fixed it.",
                          {
                            variant: 'error',
                            preventDuplicate: true,
                          }
                        )
                      })
                  } else {
                    enqueueSnackbar(
                      "Some questions were not sent because they're already being answered by our patient.",
                      {
                        variant: 'warning',
                        preventDuplicate: true,
                      }
                    )
                  }
                })
              })
            } else {
              enqueueSnackbar(
                "Your patient's email is not in one of our records.",
                {
                  variant: 'error',
                }
              )
            }
          })
          .catch(() => {
            enqueueSnackbar(
              "We had made a mess, we'll get back to you once we've fixed it.",
              {
                variant: 'error',
              }
            )
          })
      }
    }

    return (
      <Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          className="form__button"
        >
          Email Questionnaire
        </Button>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <FormControl component="fieldset" className={classes.fieldsetContainer}>
        <Alert
          variant="outlined"
          severity="error"
          elevation={3}
          style={
            !skeletonVisible && questionnaires.length === 0
              ? { visibility: `visible` }
              : { display: `none` }
          }
        >
          <strong>What a Bummer!</strong> No Questionnaires available.
        </Alert>
        <div
          style={skeletonVisible ? { display: `block` } : { display: `none` }}
        >
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <br />
          <Grid
            container
            spacing={5}
            direction="row"
            justify="space-evenly"
            alignItems="flex-start"
          >
            <Grid item xs>
              <Skeleton
                variant="rect"
                width={400}
                height={300}
                className={classes.skelContainer}
                animation="wave"
              >
                <Skeleton
                  variant="rect"
                  height={77}
                  className={classes.headerContainer}
                >
                  <Skeleton
                    variant="circle"
                    width={40}
                    height={40}
                    className={classes.alignLeft}
                  />
                  <div className={classes.alignRight}>
                    <Skeleton variant="text" width={250} />
                    <Skeleton variant="text" width={250} />
                  </div>
                </Skeleton>
                <br />
                <div className={classes.skelBody}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </Skeleton>
            </Grid>
            <Grid item xs>
              <Skeleton
                variant="rect"
                width={400}
                height={300}
                className={classes.skelContainer}
                animation="wave"
              >
                <Skeleton
                  variant="rect"
                  height={77}
                  className={classes.headerContainer}
                >
                  <Skeleton
                    variant="circle"
                    width={40}
                    height={40}
                    className={classes.alignLeft}
                  />
                  <div className={classes.alignRight}>
                    <Skeleton variant="text" width={250} />
                    <Skeleton variant="text" width={250} />
                  </div>
                </Skeleton>
                <br />
                <div className={classes.skelBody}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </Skeleton>
            </Grid>
            <Grid item xs>
              <Skeleton
                variant="rect"
                width={400}
                height={300}
                className={classes.skelContainer}
                animation="wave"
              >
                <Skeleton
                  variant="rect"
                  height={77}
                  className={classes.headerContainer}
                >
                  <Skeleton
                    variant="circle"
                    width={40}
                    height={40}
                    className={classes.alignLeft}
                  />
                  <div className={classes.alignRight}>
                    <Skeleton variant="text" width={250} />
                    <Skeleton variant="text" width={250} />
                  </div>
                </Skeleton>
                <br />
                <div className={classes.skelBody}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </Skeleton>
            </Grid>
            <Grid item xs>
              <Skeleton
                variant="rect"
                width={400}
                height={300}
                className={classes.skelContainer}
                animation="wave"
              >
                <Skeleton
                  variant="rect"
                  height={77}
                  className={classes.headerContainer}
                >
                  <Skeleton
                    variant="circle"
                    width={40}
                    height={40}
                    className={classes.alignLeft}
                  />
                  <div className={classes.alignRight}>
                    <Skeleton variant="text" width={250} />
                    <Skeleton variant="text" width={250} />
                  </div>
                </Skeleton>
                <br />
                <div className={classes.skelBody}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </div>
              </Skeleton>
            </Grid>
          </Grid>
          <br />
        </div>
        <Grid
          container
          style={
            !skeletonVisible && questionnaires.length > 0
              ? { visibility: `visible` }
              : { display: `none` }
          }
        >
          <Grid item xs={12}>
            <Typography className={classes.label}>
              Select the questionnaire to ask a patient
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              className={clsx(classes.expandButton, 'form__button_expand')}
              variant="contained"
              color={expandedAll ? 'primary' : 'secondary'}
              onClick={handleExpandAll}
            >
              {expandedAll ? (
                <Fragment>
                  Hide All Questions
                  <IoIosContract className={classes.expandButtonIcon} />
                </Fragment>
              ) : (
                <Fragment>
                  Show All Questions
                  <IoIosExpand className={classes.expandButtonIcon} />
                </Fragment>
              )}
            </Button>
          </Grid>
        </Grid>
        <br />
        <RadioGroup
          aria-label="position"
          name="position"
          value={radioValue}
          onChange={handleChange}
          row
        >
          <Grid
            container
            spacing={5}
            direction="row"
            justify="space-evenly"
            alignItems="flex-start"
          >
            {questionnaires.map(questionnaire => (
              <FormControlLabel
                key={questionnaire.id}
                value={questionnaire.id + ''}
                control={
                  <Radio
                    className={classes.root}
                    disableRipple
                    color="default"
                    checkedIcon={
                      <span
                        className={clsx(classes.icon, classes.checkedIcon)}
                      />
                    }
                    icon={<span className={classes.icon} />}
                    {...props}
                  />
                }
                labelPlacement="end"
                className={clsx('form__radio', classes.questItem, {
                  [classes.selectedItem]: radioValue == questionnaire.id,
                })}
                label={
                  <Grid item xs key={questionnaire.id}>
                    <Card
                      id={questionnaire.id}
                      elevation={6}
                      className={clsx(
                        {
                          [classes.selectedCard]:
                            radioValue == questionnaire.id,
                        },
                        classes.card
                      )}
                    >
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={questionnaire.image}
                        />
                      </CardActionArea>
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="h2"
                          className={classes.title}
                        >
                          {questionnaire.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          className={classes.subHeader}
                        >
                          Since{' '}
                          {dateformat(
                            questionnaire.created_at,
                            'mmm dd, yyyy hh:MM tt'
                          )}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Divider variant="middle" />
                        <ExpansionPanel
                          expanded={
                            expandedAll || expanded === questionnaire.id
                          }
                          onChange={handleExpansionChange(questionnaire.id)}
                          className={classes.expansionPanel}
                        >
                          <ExpansionPanelSummary
                            expandIcon={
                              <MdExpandMore
                                key={questionnaire.id}
                                className={clsx(classes.expand)}
                                aria-expanded={expanded}
                                aria-label="show more"
                              />
                            }
                            className={classes.summaryPanel}
                          ></ExpansionPanelSummary>
                          <ExpansionPanelDetails
                            className={classes.cardContent}
                          >
                            <div>
                              <Typography variant="h6" component="h2">
                                Questions:
                              </Typography>
                              <ol className="questionnaires__questions-list">
                                {questionnaire.questions.map(question => {
                                  return (
                                    <li key={question}>
                                      {questions.map(questionItem =>
                                        questionItem.id === question
                                          ? questionItem.name
                                          : ' '
                                      )}
                                    </li>
                                  )
                                })}
                              </ol>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </CardActions>
                    </Card>
                  </Grid>
                }
              />
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
      <Grid container className={classes.submitButtonContainer}>
        <Grid item xs={12}>
          <ButtonProvider {...props} />
        </Grid>
      </Grid>
    </Fragment>
  )
}
