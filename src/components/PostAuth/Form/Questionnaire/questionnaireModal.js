{
  /*
   * questionnaireModal.js
   *
   * Modal for Questionnaires
   *
   * Author: Dominic Domingo
   * Created: 2/24/2020
   *
   */
}

import React, { Fragment } from 'react'
import {
  Button,
  Dialog,
  Grid,
  DialogContent,
  useMediaQuery,
  useTheme,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MobileStepper,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core'
import { FiX } from 'react-icons/fi'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdSave,
} from 'react-icons/md'
import { getUserDetails } from '../../../utils/auth'
import nurseMedPopup from '../../../../images/nurse-med-popup.png'
import trophy from '../../../../images/trophy.png'
import axios from '../../../../presets/axios'
import SwipeableViews from 'react-swipeable-views'
import dateformat from 'dateformat'
import clsx from 'clsx'

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
  avatar: {
    marginRight: theme.spacing(1),
    backgroundColor: '#3EB5C7',
  },
  root: {
    width: '100%',
    height: '100%',
  },
  button: {
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
  },
  actionsContainer: {
    marginLeft: '35%',
  },
  resetContainer: {
    margin: 'auto',
    padding: theme.spacing(3),
  },
  middleButton: {
    marginLeft: '38%',
  },
  dialogContainer: {
    borderRadius: '0 !important',
  },
  dialogContent: {
    padding: '0 !important',
  },
  dialogRight: {
    backgroundColor: '#3eb5c7',
    minHeight: '80vh',
    position: 'sticky',
    top: 0,
    right: 0,
  },
  closeButton: {
    float: 'right',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: 'rgba(255,255,255,0.7)',
    strokeWidth: 1,
    width: 48,
    height: 48,
    transition: 'all 0.5s ease-in',
    '&:hover': {
      color: 'rgba(255,255,255,1)',
      cursor: 'pointer',
    },
  },
  questionBody: {
    minHeight: '55vh',
    paddingBottom: '1.5vh',
  },
  questionImage: {
    objectFit: 'cover',
    height: 200,
    width: 200,
    margin: '5% auto',
    transition: 'all 0.5s ease-in-out',
    border: '1px solid #fafafa',
    background: '#fbfbfb',
  },
  questionTitle: {
    textAlign: 'center',
  },
  choiceButton: {
    margin: '0 auto 2% 25%',
    padding: 15,
    minWidth: '50%',
    maxWidth: '50%',
    outline: 'none',
    borderWidth: 1.5,
    borderRadius: 3,
    alignSelf: 'center',
    transition: 'all 0.5s ease',
    fontSize: '1.1rem',
    letterSpacing: 1,
    lineHeight: 0.9,
    color: '#2699FB',
    backgroundColor: 'rgba(38, 153, 251, 0.2)',
    '&:hover, &:active': {
      backgroundColor: '#56b3ff',
      color: '#fff',
    },
  },
  yesButton: {
    color: '#fff',
    backgroundColor: '#28a745',
    borderColor: '#28A745',
    opacity: 0.5,
    '&:hover, &:active': {
      backgroundColor: '#2dc64e',
      color: '#fff',
      opacity: 0.8,
    },
  },
  noButton: {
    color: '#fff',
    backgroundColor: 'rgb(245, 0, 87)',
    borderColor: '#F50057',
    opacity: 0.5,
    '&:hover, &:active': {
      backgroundColor: '#ff025a',
      color: '#fff',
      opacity: 0.8,
    },
  },
  selectedButton: {
    opacity: 1,
    color: '#fff',
  },
  rightButton: {
    float: 'right',
  },
  textField: {
    margin: 'auto',
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -12,
  },
  dialogRightImg: {
    position: 'absolute',
    width: '40%',
    top: '23vh',
    right: '30%',
    margin: 'auto',
  },
  bubble: {
    position: 'absolute',
    background: '#fff',
    padding: 20,
    zIndex: 9999,
    top: '10vh',
    margin: 'auto 10% 0 10%',
    textAlign: 'center',
    lineHeight: 1.4,
    borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '48%',
      width: 0,
      height: 0,
      border: '20px solid transparent',
      borderTopColor: '#fff',
      borderBottom: 0,
      borderRight: 0,
      marginLeft: '-10px',
      marginBottom: '-15px',
    },
  },
}))

export default function QuestionnaireModal(props) {
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeInnerStep, setActiveInnerStep] = React.useState(0)
  const [activeStep, setActiveStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [questionSet, setQuestionSet] = React.useState(props.questionset)
  const [answer, setAnswer] = React.useState(null)
  const [assignedQuestions, setAssignedQuestions] = React.useState([])
  const [storedAnswers, setStoredAnswers] = React.useState([])
  const [doctorsName, setDoctorsName] = React.useState([])

  const firstQuestion = "OK. Here's my first question."
  const nextQuestion = 'Here is my next question...'
  const lastBubble = 'Those were all my questions!'

  const [bubbleMessage, setBubbleMessage] = React.useState(firstQuestion)

  const handleNext = last => {
    last ? setBubbleMessage(lastBubble) : setBubbleMessage(firstQuestion)
    setActiveInnerStep(0)
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setBubbleMessage(firstQuestion)
    setActiveInnerStep(0)
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setBubbleMessage(firstQuestion)
    setActiveStep(0)
    setBubbleMessage(firstQuestion)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleInnerNext = () => {
    setActiveInnerStep(prevActiveInnerStep => prevActiveInnerStep + 1)
    activeInnerStep >= 0
      ? setBubbleMessage(nextQuestion)
      : setBubbleMessage(firstQuestion)
  }

  const handleInnerBack = () => {
    setActiveInnerStep(prevActiveInnerStep => prevActiveInnerStep - 1)
    activeInnerStep <= 0
      ? setBubbleMessage(nextQuestion)
      : setBubbleMessage(firstQuestion)
  }

  const getAssignedQuestions = () => {
    if (getUserDetails('token') !== undefined)
      fetch(
        appURL +
          'api/auth/admin/questions/assigned' +
          patientParam +
          '&api_token=' +
          getUserDetails('token')
      )
        .then(response => response.json())
        .then(json => {
          const questionsPerDoctor = [
            ...new Set(
              json.data.map(questions => questions.attributes.doctor_id)
            ),
          ]

          setAssignedQuestions(
            questionsPerDoctor.map(doctor => [
              {
                doctor_id: doctor,
                assignedQuestions: json.data.filter(
                  questions =>
                    questions.attributes.doctor_id === doctor &&
                    questions.attributes.patient_id ===
                      getUserDetails('patient_id') &&
                    questions.attributes.status !== 'Closed'
                ),
              },
            ])
          )
        })
  }

  const getAnsweredQuestions = () => {
    if (getUserDetails('token') !== undefined)
      fetch(
        appURL +
          'api/auth/admin/answers' +
          patientParam +
          '&api_token=' +
          getUserDetails('token')
      )
        .then(response => response.json())
        .then(json => {
          const listAssignedQuestions = assignedQuestions.flatMap(assigned =>
            assigned.flatMap(questions =>
              questions.assignedQuestions.flatMap(
                assignedQuestions => assignedQuestions.id
              )
            )
          )

          setStoredAnswers(
            json.data.filter(questions =>
              listAssignedQuestions.includes(
                questions.attributes.assigned_question_id
              )
            )
          )
        })
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

  const getDefaultValue = (step, question) => {
    return storedAnswers
      .filter(
        answers =>
          answers.attributes.assigned_question_id ===
          Number(
            assignedQuestions
              .flatMap(assigned =>
                assigned.filter(
                  assignedQuestion =>
                    assignedQuestion.doctor_id === questionSet[step].doctor_id
                )
              )[0]
              .assignedQuestions.filter(
                assigned =>
                  question !== undefined &&
                  assigned.attributes.question_id === question.id
              )[0]
              ? assignedQuestions
                  .flatMap(assigned =>
                    assigned.filter(
                      assignedQuestion =>
                        assignedQuestion.doctor_id ===
                        questionSet[step].doctor_id
                    )
                  )[0]
                  .assignedQuestions.filter(
                    assigned =>
                      question !== undefined &&
                      assigned.attributes.question_id === question.id
                  )[0].id
              : 0
          )
      )
      .map(answer => answer.attributes.answer)
      .toString()
  }

  React.useEffect(() => {
    setQuestionSet(props.questionset)
    getAssignedQuestions()
    getAnsweredQuestions()
    getDoctorsName()
  }, [props])

  const getSteps = questionset => {
    return questionset.map(questions => {
      if (doctorsName !== []) {
        const doctor = doctorsName.filter(
          doctor => doctor.id === questions.doctor_id
        )[0]

        return doctor !== undefined ? (
          <Fragment>
            <strong>Dr. {doctor.first_name + ' ' + doctor.last_name}</strong>
            {"'s Questionnaire"}
          </Fragment>
        ) : (
          <Fragment>
            <strong>Dr. Unknown</strong>
            {"'s Questionnaire"}
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <strong>Dr. Unknown</strong>
            {"'s Questionnaire"}
          </Fragment>
        )
      }
    })
  }

  const steps = getSteps(questionSet)

  const handleStepChange = step => {
    setActiveInnerStep(step)
  }

  const handleButtonClick = async (type, choice, step, choosenAnswer) => {
    var requestUrl = ''
    var requestMethod = ''
    var param = {}
    var performUpdate = false

    if (
      choosenAnswer === undefined ||
      choosenAnswer === null ||
      choosenAnswer.length === 0 ||
      typeof choosenAnswer === 'object'
    ) {
      requestUrl = '/auth/admin/answers/store' + patientParam
      requestMethod = 'post'
      param = {
        url: requestUrl,
        method: requestMethod,
        question_id: 0,
        assigned_question_id: 0,
        answer: null,
        created_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
        updated_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
      }
    } else {
      requestUrl =
        '/auth/admin/answers/' + choosenAnswer + '/update' + patientParam
      requestMethod = 'put'
      param = {
        url: requestUrl,
        method: requestMethod,
        question_id: 0,
        assigned_question_id: 0,
        answer: null,
      }
      performUpdate = true
    }

    // prevent overloading
    if (!loading) {
      setLoading(true)

      let insertedQuestionExists =
        questionSet[step].main.filter(
          question => question.id === choice.question_link_id
        )[0] !== undefined

      // store params for adding/updating answers
      if (type == 'choice') {
        // custom data structure extraction for saving answers
        param.question_id = choice.question_id
        param.assigned_question_id = Number(
          assignedQuestions
            .filter(
              assigned => assigned[0].doctor_id === questionSet[step].doctor_id
            )[0]
            .map(assigned =>
              assigned.assignedQuestions.filter(
                questions =>
                  questions.attributes.question_id === choice.question_id
              )
            )
            .map(assigned => assigned[0].id)
            .toString()
        )
        param.answer = choice.choice
      } else if (type == 'text') {
        if (answer !== null) {
          param.question_id = choice.id
          param.assigned_question_id = Number(
            assignedQuestions
              .filter(
                assigned =>
                  assigned[0].doctor_id === questionSet[step].doctor_id
              )[0]
              .map(assigned =>
                assigned.assignedQuestions.filter(
                  questions => questions.attributes.question_id === choice.id
                )
              )
              .map(assigned => assigned[0].id)
              .toString()
          )
          param.answer = answer
        } else {
          setLoading(false)
          setBubbleMessage('Enter your answer in the field')
        }
      } else {
        console.error('Data type cannot be parsed.')
      }

      // interweave sub-question to main if and only if the
      // sub-question is not existing in the current set of questions
      // ** perform for choice types
      if (
        type == 'choice' &&
        choice.question_link_id !== null &&
        questionSet[step].main.filter(
          question => question.id === choice.question_link_id
        )[0] === undefined &&
        !performUpdate
      ) {
        if (!insertedQuestionExists) {
          const postUrl = '/auth/admin/questions/assigned/store' + patientParam
          const requestMethod = 'post'

          const param = {
            url: postUrl,
            method: requestMethod,
            data: {
              url: postUrl,
              method: requestMethod,
              patient_id: getUserDetails('patient_id'),
              doctor_id: questionSet[step].doctor_id,
              question_id: Number(choice.question_link_id),
              status: 'Open',
              assign_date: dateformat(new Date(), 'isoDate'),
              assign_time: dateformat(new Date(), 'isoTime'),
              last_answered: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
              created_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
              updated_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
            },
          }

          await axios(param)
            .then(response => {
              switch (response.status) {
                case 201:
                  getAssignedQuestions()

                  setTimeout(
                    questionSet[step].main.splice(
                      questionSet[step].main
                        .map(question => question.id)
                        .indexOf(choice.question_id) + 1,
                      0,
                      questionSet[step].sub.filter(
                        question => question.id === choice.question_link_id
                      )[0]
                    ),
                    500
                  )
                  break
                default:
                  console.debug('Something went wrong.')
              }
            })
            .catch(error => console.error(error))
        }
      }

      // interweave sub-question to main if and only if the
      // sub-question is not existing in the current set of questions
      // ** perform for text types
      if (type == 'text' && choosenAnswer !== undefined) {
        if (
          choosenAnswer.question_link_id !== null &&
          !insertedQuestionExists &&
          typeof choosenAnswer.question_link_id !== 'undefined'
        ) {
          const postUrl = '/auth/admin/questions/assigned/store' + patientParam
          const requestMethod = 'post'

          const param = {
            url: postUrl,
            method: requestMethod,
            data: {
              url: postUrl,
              method: requestMethod,
              patient_id: getUserDetails('patient_id'),
              doctor_id: questionSet[step].doctor_id,
              question_id: Number(choosenAnswer.question_link_id),
              status: 'Open',
              assign_date: dateformat(new Date(), 'isoDate'),
              assign_time: dateformat(new Date(), 'isoTime'),
              last_answered: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
              created_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
              updated_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
            },
          }

          await axios(param)
            .then(response => {
              switch (response.status) {
                case 201:
                  getAssignedQuestions()

                  setTimeout(
                    questionSet[step].main.splice(
                      questionSet[step].main
                        .map(question => question.id)
                        .indexOf(choosenAnswer.id) + 1,
                      0,
                      questionSet[step].sub.filter(
                        question =>
                          question.id === choosenAnswer.question_link_id
                      )[0]
                    ),
                    500
                  )
                  break
                default:
                  console.debug('Something went wrong.')
              }
            })
            .catch(error => console.error(error))
        }
      }

      // remove previously added question from assignedQuestions and questionSet
      if (type == 'choice' && performUpdate) {
        var insertedQuestionIdArr = []

        for (
          let i = 1;
          questionSet[step].main[
            questionSet[step].main
              .map(question => question.id)
              .indexOf(choice.question_id) + i
          ] !== undefined &&
          !questionSet[step].main[
            questionSet[step].main
              .map(question => question.id)
              .indexOf(choice.question_id) + i
          ].original;
          i++
        ) {
          insertedQuestionIdArr.push(
            questionSet[step].main[
              questionSet[step].main
                .map(question => question.id)
                .indexOf(choice.question_id) + i
            ] !== undefined
              ? questionSet[step].main[
                  questionSet[step].main
                    .map(question => question.id)
                    .indexOf(choice.question_id) + i
                ].id
              : 0
          )
        }

        if (insertedQuestionIdArr.length > 0) {
          insertedQuestionIdArr.forEach(insertedQuestionId => {
            var assignedQuestionId = 0
            var patientAnswerId = 0

            if (insertedQuestionId > 0) {
              if (
                questionSet[step].main.filter(
                  question => question.id === insertedQuestionId
                )[0].original === false &&
                !insertedQuestionExists
              ) {
                assignedQuestionId = assignedQuestions.flatMap(assigned =>
                  assigned[0].assignedQuestions.filter(
                    question =>
                      question.attributes.question_id === insertedQuestionId
                  )
                )[0].id

                patientAnswerId =
                  storedAnswers.filter(
                    stored =>
                      stored.attributes.assigned_question_id ===
                      assignedQuestionId
                  )[0] !== undefined
                    ? storedAnswers.filter(
                        stored =>
                          stored.attributes.assigned_question_id ===
                          assignedQuestionId
                      )[0].id
                    : 0
              }
            }

            if (
              questionSet[step].main.filter(
                question => question.id === choice.question_link_id
              )[0] === undefined
            ) {
              // remove in /answers then in /questions/assigned
              // before inserting a new question
              fetch(
                appURL +
                  'api/auth/admin/answers/' +
                  patientAnswerId +
                  patientParam +
                  '&api_token=' +
                  getUserDetails('token'),
                {
                  method: 'DELETE',
                }
              ).then(() => {
                fetch(
                  appURL +
                    'api/auth/admin/questions/assigned/delete/' +
                    assignedQuestionId +
                    patientParam +
                    '&api_token=' +
                    getUserDetails('token')
                ).then(
                  questionSet[step].main.splice(
                    questionSet[step].main
                      .map(question => question.id)
                      .indexOf(choice.question_id) + 1,
                    insertedQuestionIdArr.length
                  )
                )
              })
            }
          })

          if (
            choice.question_link_id !== null &&
            questionSet[step].main.filter(
              question => question.id === choice.question_link_id
            )[0] === undefined
          ) {
            const postUrl =
              '/auth/admin/questions/assigned/store' + patientParam
            const requestMethod = 'post'

            const param = {
              url: postUrl,
              method: requestMethod,
              data: {
                url: postUrl,
                method: requestMethod,
                patient_id: getUserDetails('patient_id'),
                doctor_id: questionSet[step].doctor_id,
                question_id: Number(choice.question_link_id),
                status: 'Open',
                assign_date: dateformat(new Date(), 'isoDate'),
                assign_time: dateformat(new Date(), 'isoTime'),
                last_answered: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
                created_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
                updated_at: dateformat(new Date(), 'yyyy-mm-dd UTC:HH:MM:ss Z'),
              },
            }

            if (
              questionSet[step].main.filter(
                question => question.id === choice.question_link_id
              )[0] === undefined
            )
              axios(param).then(async response => {
                switch (response.status) {
                  case 201:
                    setTimeout(() => {
                      getAssignedQuestions()

                      questionSet[step].main.splice(
                        questionSet[step].main
                          .map(question => question.id)
                          .indexOf(choice.question_id) + 1,
                        0,
                        questionSet[step].sub.filter(
                          question => question.id === choice.question_link_id
                        )[0]
                      )
                    }, 1000)
                    break
                  default:
                    console.debug('Something went wrong.')
                }
              })
          }
        } else {
          const isNextOriginal =
            questionSet[step].main[
              questionSet[step].main
                .map(question => question.id)
                .indexOf(choice.question_id) + 1
            ] !== undefined
              ? questionSet[step].main[
                  questionSet[step].main
                    .map(question => question.id)
                    .indexOf(choice.question_id) + 1
                ].original
              : true

          const insertedQuestionId =
            questionSet[step].main[
              questionSet[step].main
                .map(question => question.id)
                .indexOf(choice.question_id) + 1
            ] !== undefined
              ? questionSet[step].main[
                  questionSet[step].main
                    .map(question => question.id)
                    .indexOf(choice.question_id) + 1
                ].id
              : 0

          var assignedQuestionId = 0
          var patientAnswerId = 0

          if (insertedQuestionId > 0) {
            if (
              questionSet[step].main.filter(
                question => question.id === insertedQuestionId
              )[0].original === false &&
              !insertedQuestionExists
            ) {
              assignedQuestionId = assignedQuestions.flatMap(assigned =>
                assigned[0].assignedQuestions.filter(
                  question =>
                    question.attributes.question_id === insertedQuestionId
                )
              )[0].id

              patientAnswerId =
                storedAnswers.filter(
                  stored =>
                    stored.attributes.assigned_question_id ===
                    assignedQuestionId
                )[0] !== undefined
                  ? storedAnswers.filter(
                      stored =>
                        stored.attributes.assigned_question_id ===
                        assignedQuestionId
                    )[0].id
                  : 0
            }
          }

          if (!insertedQuestionExists) {
            // remove in /answers then in /questions/assigned
            // before inserting a new question
            await fetch(
              appURL +
                'api/auth/admin/answers/' +
                patientAnswerId +
                patientParam +
                '&api_token=' +
                getUserDetails('token'),
              {
                method: 'DELETE',
              }
            ).then(() => {
              fetch(
                appURL +
                  'api/auth/admin/questions/assigned/delete/' +
                  assignedQuestionId +
                  patientParam +
                  '&api_token=' +
                  getUserDetails('token')
              ).then(() => {
                if (!isNextOriginal) {
                  setTimeout(
                    questionSet[step].main.splice(
                      questionSet[step].main
                        .map(question => question.id)
                        .indexOf(choice.question_id) + 1,
                      1
                    ),
                    500
                  )
                }

                if (choice.question_link_id !== null) {
                  const postUrl =
                    '/auth/admin/questions/assigned/store' + patientParam
                  const requestMethod = 'post'

                  const param = {
                    url: postUrl,
                    method: requestMethod,
                    data: {
                      url: postUrl,
                      method: requestMethod,
                      patient_id: getUserDetails('patient_id'),
                      doctor_id: questionSet[step].doctor_id,
                      question_id: Number(choice.question_link_id),
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
                  axios(param).then(response => {
                    switch (response.status) {
                      case 201:
                        getAssignedQuestions()

                        setTimeout(
                          questionSet[step].main.splice(
                            questionSet[step].main
                              .map(question => question.id)
                              .indexOf(choice.question_id) + 1,
                            0,
                            questionSet[step].sub.filter(
                              question =>
                                question.id === choice.question_link_id
                            )[0]
                          ),
                          500
                        )
                        break
                      default:
                        console.debug('Something went wrong.')
                    }
                  })
                }
              })
            })
          }
        }
      }

      // get ready before performing server request
      const options = {
        url: requestUrl,
        method: requestMethod,
        data: param,
      }

      setTimeout(() => {
        if (!insertedQuestionExists)
          axios(options)
            .then(response => {
              if (response.status > 199 && response.status < 300) {
                fetch(
                  appURL +
                    'api/auth/admin/questions/assigned/change_status/' +
                    param.assigned_question_id +
                    patientParam +
                    '&api_token=' +
                    getUserDetails('token') +
                    '&status=Answered'
                )

                setLoading(false)
                getAnsweredQuestions()
                setAnswer(null)
                if (activeInnerStep < questionSet[step].main.length - 1)
                  handleInnerNext()
                else handleNext(activeStep === steps.length - 1)
              }
            })
            .catch(error => {
              console.error(error)
            })
        else {
          setLoading(false)
          getAnsweredQuestions()
          setAnswer(null)
          if (activeInnerStep < questionSet[step].main.length - 1)
            handleInnerNext()
          else handleNext(activeStep === steps.length - 1)
        }
      }, 2000)
    }
  }

  const getStepContent = step => {
    return (
      <div className={classes.root}>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeInnerStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {questionSet[step].main.map(question => (
            <Grid container key={question.id} className={classes.questionBody}>
              <Grid item xs={12}>
                <h2 className={classes.questionTitle}>{question.question}</h2>
              </Grid>
              <img
                src={question.image}
                className={classes.questionImage}
                alt={question.question}
              />
              <Grid container>
                {question.choices.length > 0 ? (
                  question.choices.map(choice => {
                    let choosenAnswer = storedAnswers
                      .filter(
                        answers =>
                          answers.attributes.assigned_question_id ===
                          Number(
                            assignedQuestions
                              .flatMap(assigned =>
                                assigned.filter(
                                  assignedQuestion =>
                                    assignedQuestion.doctor_id ===
                                    questionSet[step].doctor_id
                                )
                              )[0]
                              .assignedQuestions.filter(
                                assigned =>
                                  assigned.attributes.question_id ===
                                  choice.question_id
                              )[0] !== undefined
                              ? assignedQuestions
                                  .flatMap(assigned =>
                                    assigned.filter(
                                      assignedQuestion =>
                                        assignedQuestion.doctor_id ===
                                        questionSet[step].doctor_id
                                    )
                                  )[0]
                                  .assignedQuestions.filter(
                                    assigned =>
                                      assigned.attributes.question_id ===
                                      choice.question_id
                                  )[0].id
                              : 0
                          )
                      )
                      .map(answer => answer.id)[0]

                    return (
                      <Grid
                        item
                        xs={6}
                        key={choice.id}
                        className={classes.wrapper}
                      >
                        <Button
                          variant="outlined"
                          className={clsx(
                            classes.choiceButton,
                            { [classes.yesButton]: choice.choice === 'Yes' },
                            { [classes.noButton]: choice.choice === 'No' },
                            'questionnaire__button',
                            {
                              [classes.selectedButton]:
                                choice.choice ==
                                storedAnswers
                                  .filter(
                                    answers =>
                                      answers.attributes
                                        .assigned_question_id ===
                                      Number(
                                        assignedQuestions
                                          .flatMap(assigned =>
                                            assigned.filter(
                                              assignedQuestion =>
                                                assignedQuestion.doctor_id ===
                                                questionSet[step].doctor_id
                                            )
                                          )[0]
                                          .assignedQuestions.filter(
                                            assigned =>
                                              assigned.attributes
                                                .question_id ===
                                              choice.question_id
                                          )[0] !== undefined
                                          ? assignedQuestions
                                              .flatMap(assigned =>
                                                assigned.filter(
                                                  assignedQuestion =>
                                                    assignedQuestion.doctor_id ===
                                                    questionSet[step].doctor_id
                                                )
                                              )[0]
                                              .assignedQuestions.filter(
                                                assigned =>
                                                  assigned.attributes
                                                    .question_id ===
                                                  choice.question_id
                                              )[0].id
                                          : 0
                                      )
                                  )
                                  .map(answer => answer.attributes.answer)
                                  .toString(),
                            }
                          )}
                          size="large"
                          disabled={loading}
                          onClick={() => {
                            handleButtonClick(
                              'choice',
                              choice,
                              step,
                              choosenAnswer
                            )
                          }}
                        >
                          {choice.choice}
                        </Button>
                        {loading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </Grid>
                    )
                  })
                ) : (
                  <div className={clsx(classes.textField)}>
                    <TextField
                      label="Your answer..."
                      variant="outlined"
                      onChange={input => {
                        if (input.target.value.length > 0) {
                          setBubbleMessage('Make sure to SAVE your answer')
                          setAnswer(input.target.value)
                        } else {
                          setBubbleMessage('Enter your answer in the field')
                        }
                      }}
                      defaultValue={getDefaultValue(step, question)}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            className="save-button"
                            onClick={() => {
                              const questionId = assignedQuestions
                                .flatMap(assigned =>
                                  assigned.filter(
                                    assignedQuestion =>
                                      assignedQuestion.doctor_id ===
                                      questionSet[step].doctor_id
                                  )
                                )[0]
                                .assignedQuestions.filter(
                                  assigned =>
                                    assigned.attributes.question_id ===
                                    question.id
                                )[0].attributes.question_id

                              handleButtonClick(
                                'text',
                                question,
                                step,
                                storedAnswers
                                  .filter(
                                    answers =>
                                      answers.attributes
                                        .assigned_question_id ===
                                      Number(
                                        assignedQuestions
                                          .flatMap(assigned =>
                                            assigned.filter(
                                              assignedQuestion =>
                                                assignedQuestion.doctor_id ===
                                                questionSet[step].doctor_id
                                            )
                                          )[0]
                                          .assignedQuestions.filter(
                                            assigned =>
                                              assigned.attributes
                                                .question_id === question.id
                                          )[0].id
                                      )
                                  )
                                  .map(answer => answer.id)[0] !== undefined
                                  ? storedAnswers
                                      .filter(
                                        answers =>
                                          answers.attributes
                                            .assigned_question_id ===
                                          Number(
                                            assignedQuestions
                                              .flatMap(assigned =>
                                                assigned.filter(
                                                  assignedQuestion =>
                                                    assignedQuestion.doctor_id ===
                                                    questionSet[step].doctor_id
                                                )
                                              )[0]
                                              .assignedQuestions.filter(
                                                assigned =>
                                                  assigned.attributes
                                                    .question_id === question.id
                                              )[0].id
                                          )
                                      )
                                      .map(answer => answer.id)[0]
                                  : questionSet[step].main.filter(
                                      question => question.id === questionId
                                    )[0]
                              )
                            }}
                          >
                            {loading ? (
                              <CircularProgress />
                            ) : (
                              <span
                                style={{
                                  backgroundColor: `#8db6d9`,
                                  color: `#1e527c`,
                                  padding: `12px 5px 10px 5px`,
                                  marginRight: -15,
                                  borderRadius: `0 5px 5px 0`,
                                }}
                              >
                                <MdSave /> Save
                              </span>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          ))}
        </SwipeableViews>
        <MobileStepper
          variant="progress"
          steps={questionSet[step].main.length}
          position="static"
          activeStep={activeInnerStep}
          className={classes.root}
          nextButton={
            <Button
              size="small"
              onClick={handleInnerNext}
              disabled={activeInnerStep === questionSet[step].main.length - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <MdKeyboardArrowLeft />
              ) : (
                <MdKeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleInnerBack}
              disabled={activeInnerStep === 0}
            >
              {theme.direction === 'rtl' ? (
                <MdKeyboardArrowRight />
              ) : (
                <MdKeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <Fragment>
      <Button
        variant="contained"
        color="secondary"
        style={{
          float: `right`,
          borderRadius: `3px`,
          marginTop: `30px`,
          background: `#03c03c`,
          color: '#fff',
        }}
        className="questionnaire__button"
        onClick={handleClickOpen}
        disabled={questionSet.length === 0}
      >
        I'm Ready!
      </Button>
      <Dialog
        fullWidth={true}
        fullScreen={fullScreen}
        open={open}
        maxWidth="md"
        onClose={handleClose}
        className={classes.dialogContainer}
      >
        <DialogContent className={classes.dialogContent}>
          <Grid container className={classes.root}>
            <Grid item sm={8} xs={9}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <Grid container>{getStepContent(index)}</Grid>
                      {activeInnerStep + 1 ===
                        questionSet[index].main.length && (
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              className={clsx(
                                classes.rightButton,
                                classes.button,
                                'questionnaire__button'
                              )}
                            >
                              {activeStep === 0 ? 'No Prev Set' : 'Prev Set'}
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                handleNext(activeStep === steps.length - 1)
                              }}
                              className={clsx(
                                classes.button,
                                'questionnaire__button'
                              )}
                            >
                              {activeStep === steps.length - 1
                                ? 'Finish'
                                : 'Next Set'}
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Grid container className={classes.questionBody}>
                  <hr className="sidebar__hr" style={{ width: `100%` }} />
                  <Grid item xs={12}>
                    <h2 style={{ textAlign: `center` }}>
                      Thank you for your response!
                    </h2>
                  </Grid>
                  <img
                    src={trophy}
                    alt="trophy"
                    className={classes.questionImage}
                  />
                  <Grid item xs={12}>
                    <p
                      style={{
                        textAlign: `center`,
                        maxWidth: `400px`,
                        margin: `20px auto 0 auto`,
                      }}
                    >
                      Your answers have been recorded, and will be helpful for
                      us to serve you better!
                    </p>
                  </Grid>
                  <Grid container spacing={1} style={{ padding: `20px` }}>
                    <Grid item xs={12} sm={6} style={{ padding: `2px 10px` }}>
                      <Button
                        onClick={handleReset}
                        className={clsx(
                          classes.rightButton,
                          classes.button,
                          'questionnaire__button'
                        )}
                      >
                        Back to top
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ padding: `2px 10px` }}>
                      <Button
                        onClick={handleClose}
                        className={clsx(
                          classes.button,
                          classes.yesButton,
                          'questionnaire__button'
                        )}
                        style={{ opacity: 0.8 }}
                      >
                        Complete
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item sm={4} xs={3} className={classes.dialogRight}>
              <div className="questionModal__unmovable-right">
                <FiX className={classes.closeButton} onClick={handleClose} />
                <div className={clsx([classes.bubble], 'bubble__message')}>
                  {bubbleMessage}
                </div>
                <img
                  src={nurseMedPopup}
                  className={clsx([classes.dialogRightImg], 'dialog__image')}
                  alt="nurse-med"
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
