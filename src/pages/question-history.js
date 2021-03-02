{
  /*
   * question-history.js
   *
   * Page for Question History screen (/question-history)
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React from 'react'
import Content from '../components/PostAuth/Layout/content'
import SEO from '../components/utils/seo'
import { Grid } from '@material-ui/core'
import { IoMdList } from 'react-icons/io'
import { AiOutlineTable } from 'react-icons/ai'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import QuestionHistoryList from '../components/PostAuth/Form/QuestionHistory/questionHistoryList'
import QuestionHistoryTable from '../components/PostAuth/Form/QuestionHistory/questionHistoryTable'
import { getUserDetails } from '../components/utils/auth'
const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

let appBaseURL = process.env.APP_URL
const appURL =
  appBaseURL.slice(appBaseURL.length - 1) === '/'
    ? appBaseURL
    : appBaseURL + '/'

const connectParam = '?path=' + process.env.ADMIN_PATH_URL
const patientParam = '?path=' + process.env.PATIENT_PATH_URL

class QuestionHistory extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      viewList: true,
      answeredList: [],
      questionList: [],
      assignedQuestionSet: [],
      assignedIdList: [],
      isLoading: true,
      hideActions: true,
    }
  }

  getAssignedQuestions() {
    this.setState({
      isLoading: true,
    })

    fetch(
      appURL +
        'api/auth/admin/questions/assigned' +
        patientParam +
        '&api_token=' +
        getUserDetails('token')
    )
      .then(response => response.json())
      .then(json => {
        const assignedQuestionSet = json.data.filter(question =>
          getUserDetails('is_patient')
            ? question.attributes.patient_id === getUserDetails('patient_id')
            : question.attributes.doctor_id === getUserDetails('user_id')
        )

        assignedQuestionSet.forEach(
          async question =>
            await fetch(
              appURL +
                'api/auth/doctor?path=' +
                process.env.AUTH_PATH +
                '&token=' +
                getUserDetails('token')
            )
              .then(response => response.json())
              .then(json => {
                json.filter !== undefined
                  ? (question.doctor = json.filter(
                      doctor => doctor.id === question.attributes.doctor_id
                    )[0])
                  : (question.doctor = null)
              })
        )

        const assignedIdList = assignedQuestionSet.flatMap(assigned => [
          {
            assigned_id: assigned.id,
            question_id: assigned.attributes.question_id,
          },
        ])

        const questionIdList = assignedQuestionSet.map(
          assigned => assigned.attributes.question_id
        )

        fetch(
          appURL +
            'api/auth/admin/answers' +
            patientParam +
            '&api_token=' +
            getUserDetails('token')
        )
          .then(response => response.json())
          .then(json => {
            const answeredList = json.data.filter(answers => answers)

            fetch(
              appURL +
                'api/data/questions' +
                connectParam +
                '&lang=en&api_token=' +
                getUserDetails('token')
            )
              .then(response => response.json())
              .then(json => {
                const questionList = json.question.filter(question =>
                  questionIdList.includes(question.id)
                )

                this.setState({
                  answeredList: answeredList,
                  questionList: questionList,
                  assignedQuestionSet: assignedQuestionSet,
                  assignedIdList: assignedIdList,
                })
              })
              .then(() => {
                this.setState({
                  isLoading: false,
                  hideActions: getUserDetails('is_patient'),
                })
              })
          })
      })
  }

  componentDidMount() {
    this.getAssignedQuestions()
  }

  render() {
    return (
      <Content>
        <SEO title="Question History" />
        <Grid container style={{ marginBottom: `20px` }}>
          <Grid item xs="6">
            <h6
              style={{
                marginTop: `10px`,
                fontWeight: `bold`,
                color: `#505050`,
              }}
            >
              Question History
            </h6>
          </Grid>
          <Grid item xs="6">
            <ToggleButtonGroup
              color="primary"
              value={this.state.viewList}
              exclusive
              size="small"
              style={{ float: `right` }}
            >
              <ToggleButton
                size="sm"
                value={true}
                style={{ cursor: `pointer` }}
                onClick={() => {
                  this.setState({
                    viewList: true,
                  })
                }}
              >
                <IoMdList style={{ marginRight: 5 }} /> Lists
              </ToggleButton>
              <ToggleButton
                size="sm"
                value={false}
                style={{ cursor: `pointer` }}
                onClick={() => {
                  this.setState({
                    viewList: false,
                  })
                }}
              >
                <AiOutlineTable style={{ marginRight: 5 }} /> Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <hr className="sidebar__hr" />
        {this.state.viewList ? (
          <QuestionHistoryList />
        ) : (
          <QuestionHistoryTable
            answeredList={this.state.answeredList}
            questionList={this.state.questionList}
            assignedQuestionSet={this.state.assignedQuestionSet}
            assignedIdList={this.state.assignedIdList}
            isLoading={this.state.isLoading}
            hideActions={this.state.hideActions}
            getAssignedQuestions={this.getAssignedQuestions.bind(this)}
          />
        )}
      </Content>
    )
  }
}

export default QuestionHistory
