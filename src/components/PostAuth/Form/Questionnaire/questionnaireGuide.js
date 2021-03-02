{
  /*
   * questionnaireGuide.js
   *
   * Modal for Questionnaires Guide
   *
   * Author: Dominic Domingo
   * Created: 2/24/2020
   *
   */
}

import React, { Fragment } from 'react'
import Img from 'gatsby-image'
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { FiX } from 'react-icons/fi'
import { useStaticQuery, graphql } from 'gatsby'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(2),
    width: '30px',
    height: '30px',
    opacity: 0.5,
    strokeWidth: 1,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      opacity: 0.8,
      cursor: 'pointer',
    },
  },
  doneButton: {
    marginTop: theme.spacing(1),
    background: green[500],
    color: '#fff',
    '&:hover': {
      background: green[600],
    },
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  title: {
    margin: '2%',
    fontWeight: 'bold',
    borderBottom: '5px solid rgba(63, 81, 181, 0.5)',
    paddingBottom: '10px',
  },
  imageGuide: {
    width: '50%',
    marginBottom: '2%',
  },
}))

const Image = props => {
  const classes = useStyles()
  const data = useStaticQuery(
    graphql`
      query {
        placeholderImage: file(
          relativePath: { eq: "questionnaire-guide-1.png" }
        ) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        placeholderImage2: file(
          relativePath: { eq: "questionnaire-guide-2.png" }
        ) {
          childImageSharp {
            fluid(quality: 100, maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )

  return props.step === 0 ? (
    <Img
      fluid={data.placeholderImage.childImageSharp.fluid}
      className={classes.imageGuide}
      alt="guide-1"
    />
  ) : (
    <Img
      fluid={data.placeholderImage2.childImageSharp.fluid}
      className={classes.imageGuide}
      alt="guide-2"
    />
  )
}

function getSteps() {
  return ['Read Questions Carefully', 'Select/Enter your Answer']
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <Fragment>
          <Image step={step} />
          Alright! Your Questions will be shown here, which are either
          answerable by: <br />
          a. <strong>Selecting the best choice</strong>; or
          <br />
          b. an <strong>Input box</strong>
        </Fragment>
      )
    case 1:
      return (
        <Fragment>
          <Image step={step} />
          For us to serve you better, we ask you to answer the questions
          <strong> honestly</strong>.
          <br />
          <br />
        </Fragment>
      )
    default:
      return 'Unknown step'
  }
}

export default function QuestionnaireGuide(props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.root}>
      <h6 className={classes.title}>How to Answer the Questionnaire?</h6>
      <FiX
        className={classes.closeIcon}
        onClick={() => {
          props.handleHideModal()
        }}
      />
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <strong>{label}</strong>
            </StepLabel>
            <StepContent>
              <div>{getStepContent(index)}</div>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>
            Now you&apos;re ready to answer the questionnaire!
          </Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
          <Button
            onClick={() => {
              props.handleHideModal()
            }}
            className={classes.doneButton}
            variant="contained"
          >
            Done
          </Button>
        </Paper>
      )}
    </div>
  )
}
