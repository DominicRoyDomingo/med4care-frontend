{
  /*
   * questionnaires.js
   *
   * Page for Questionnaires screen (/questionnaires)
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React, { Fragment } from 'react'
import { useStaticQuery, graphql, navigate } from 'gatsby'
import Img from 'gatsby-image'
import Content from '../components/PostAuth/Layout/content'
import { getUserDetails } from '../components/utils/auth'
import SEO from '../components/utils/seo'
import QuestionsModal from '../components/utils/questionsModal'
import QuestionnaireModal from '../components/PostAuth/Form/Questionnaire/questionnaireModal'
import fetch from 'isomorphic-fetch'
import { Button, Grid } from '@material-ui/core'
import QuestionnaireGuide from '../components/PostAuth/Form/Questionnaire/questionnaireGuide'
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

class Questionnaires extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      showModal: false,
      modalBody: '',
      questionSet: [],
    }
  }

  componentDidMount() {
    let appBaseURL = process.env.APP_URL
    const appURL =
      appBaseURL.slice(appBaseURL.length - 1) === '/'
        ? appBaseURL
        : appBaseURL + '/'

    const patientParam = '?path=' + process.env.PATIENT_PATH_URL

    this.setState({
      firstName: getUserDetails('first_name'),
    })

    if (!getUserDetails('is_patient')) navigate('/home')

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

        questionsPerDoctor.forEach(question => {
          const assignedQuestions = json.data.filter(
            questions =>
              questions.relationships.patient.email ==
                getUserDetails('email') &&
              questions.attributes.status !== 'Closed' &&
              question === questions.attributes.doctor_id
          )

          const questionsIdList = assignedQuestions.map(
            questions => questions.attributes.question_id
          )

          fetch(
            appURL +
              'api/data/questions?path=' +
              process.env.ADMIN_PATH_URL +
              '&lang=en&api_token=' +
              getUserDetails('token')
          )
            .then(response => response.json())
            .then(json => {
              const filteredSet = json.question.filter(question =>
                questionsIdList.includes(question.id)
              )

              filteredSet.forEach(question => (question.original = true))

              if (filteredSet.length > 0) {
                const linkedQuestions = [
                  ...new Set(
                    filteredSet
                      .flatMap(question =>
                        question.choices.map(choice => choice.question_link_id)
                      )
                      .filter(link => link !== null)
                      .concat(
                        filteredSet
                          .flatMap(question => question.question_link_id)
                          .filter(link => link !== null)
                      )
                  ),
                ]

                const filteredSubset = json.question
                  .filter(question => linkedQuestions.includes(question.id))
                  .concat(
                    json.question.filter(question =>
                      json.question
                        .filter(question =>
                          linkedQuestions.includes(question.id)
                        )
                        .flatMap(question => question.question_link_id)
                        .filter(link => link !== null)
                        .includes(question.id)
                    )
                  )

                filteredSubset.forEach(question => (question.original = false))

                this.setState({
                  questionSet: this.state.questionSet.concat({
                    doctor_id: question,
                    main: filteredSet,
                    sub: filteredSubset,
                  }),
                })
              }
            })
        })
      })
      .catch(error => console.debug('Error: ' + error))
  }

  handleHideModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  setModalGuide() {
    this.setState({
      showModal: true,
      modalBody: (
        <Fragment>
          <QuestionnaireGuide
            handleHideModal={this.handleHideModal.bind(this)}
          />
        </Fragment>
      ),
    })
  }

  render() {
    return (
      <Content>
        <QuestionsModal
          show={this.state.showModal}
          message={this.state.modalBody}
          handleHideModal={this.handleHideModal.bind(this)}
        />
        <SEO title="Questionnaires" />
        <Grid container spacing={10}>
          <Grid item xs={12} sm={8}>
            <h1>
              Hey there, <strong>{this.state.firstName}</strong>!
            </h1>
            <br />
            <h4>
              In this section, we'd like to know more about you!
              <br />
              <br />
              Kindly help us to serve you, by answering some questions.
              <br />
              <br />
              If you need some help, I could <strong>guide</strong> you on how
              you can answer this questionnaire.
              <br />
              <br />
              Once ready, click on <strong>I'm ready</strong> to begin.
            </h4>
            <Button
              variant="contained"
              style={{
                borderRadius: `3px`,
                marginTop: `30px`,
                color: `#fff`,
              }}
              className="questionnaire__button"
              color="secondary"
              onClick={() => {
                this.setModalGuide()
              }}
            >
              Guide Me First
            </Button>
            <QuestionnaireModal questionset={this.state.questionSet} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Image />
          </Grid>
        </Grid>
      </Content>
    )
  }
}

export default Questionnaires
