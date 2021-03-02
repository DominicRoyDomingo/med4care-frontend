{
  /*
   * formContainer.js
   *
   * Component for Pre-authenticated Forms :)
   * primarily used by pre-authenticated Forms
   * i.e. Log In, Sign Up, Forgot Password, etc.
   *
   * Author: Dominic Domingo
   * Created: 11/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FiMail, FiEyeOff, FiEye, FiUser, FiUsers } from 'react-icons/fi'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import { isValidEmail, isValidPassword } from '../../utils/validations'
import ModalNotification from '../../utils/modalNotification'
import axios from '../../../presets/axios'
import ResendCountdown from './resendCountdown'
import { handleUserAuth } from '../../utils/auth'
import { Grid, Button, makeStyles } from '@material-ui/core'
import { red, blue } from '@material-ui/core/colors'
import { Flip } from 'react-reveal'
import { useSnackbar } from 'notistack'
import clsx from 'clsx'
const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

const connectPathParam = '?path=' + process.env.AUTH_PATH

const useStyles = makeStyles(theme => ({
  preAuthFieldLabel: {
    marginBottom: 0,
    fontSize: '16px',
  },
  preAuthFormField: {
    borderColor: blue[900],
    borderRadius: 0,
    fontSize: '16px',
    borderRight: 0,
  },
  preAuthAppend: {
    backgroundColor: 'white',
    borderColor: blue[900],
    borderLeft: 0,
    borderRadius: 0,
    color: blue[900],
  },
  append: {
    height: '39.5px',
  },
  invalidField: {
    borderColor: red[900],
  },
  invalidAppend: {
    borderColor: red[900],
    color: red[900],
  },
}))

const ForgotPassword = ({ showForgot }) => {
  return showForgot ? (
    <Fragment>
      <AniLink
        cover
        direction="up"
        duration={1.5}
        bg="#fff"
        to="/forgot/"
        style={{
          color: `#146acc`,
          float: `right`,
          fontSize: `16px`,
          fontWeight: `600`,
        }}
      >
        FORGOT PASSWORD?
      </AniLink>
      <br />
    </Fragment>
  ) : (
    <Fragment></Fragment>
  )
}

export default function FormContainer(props) {
  const classes = useStyles()
  const [isPasswordHidden, setIsPasswordHidden] = React.useState(true)
  const [firstName, setFirstName] = React.useState(null)
  const [lastName, setLastName] = React.useState(null)
  const [email, setEmail] = React.useState(null)
  const [password, setPassword] = React.useState(null)
  const [invalidFirstName, setInvalidFirstName] = React.useState(false)
  const [invalidLastName, setInvalidLastName] = React.useState(false)
  const [invalidEmail, setInvalidEmail] = React.useState(false)
  const [invalidPassword, setInvalidPassword] = React.useState(false)
  const [validateForm, setValidateForm] = React.useState(false)
  const submitButton = React.useRef()

  function triggerSubmitButtonClick() {
    submitButton.current.focus()
  }

  function setDisableValue() {
    switch (props.button) {
      case 'SIGN UP':
        return (
          invalidFirstName || invalidLastName || invalidEmail || invalidPassword
        )
      case 'LOG IN':
        return invalidEmail || invalidPassword
      case 'RESET PASSWORD':
        return invalidEmail
      default:
        return true
    }
  }
  return (
    <Form
      style={{
        marginTop: `30px`,
      }}
      noValidate
      validated={validateForm}
    >
      <Grid container spacing={1}>
        <Grid item xs>
          <Form.Group
            controlId="formGroupFirstName"
            style={
              props.signup
                ? {
                    display: `block`,
                    margin: `0`,
                  }
                : {
                    display: `none`,
                  }
            }
          >
            <Form.Label className={classes.preAuthFieldLabel}>
              First Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                required={props.signup ? true : false}
                type="text"
                placeholder="John"
                autoComplete="off"
                className={clsx(classes.preAuthFormField, {
                  [classes.invalidField]: invalidFirstName,
                })}
                onInput={input => {
                  setValidateForm(true)

                  if (input.target.value.length === 0) setInvalidFirstName(true)
                  else {
                    setFirstName(input.target.value)
                    setInvalidFirstName(false)
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    triggerSubmitButtonClick()
                  }
                }}
              />
              <InputGroup.Append className={classes.append}>
                <InputGroup.Text
                  className={clsx(classes.preAuthAppend, {
                    [classes.invalidAppend]: invalidFirstName,
                  })}
                >
                  <FiUser />
                </InputGroup.Text>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">
                <Flip top opposite>
                  First Name is required.
                </Flip>
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Grid>
        <Grid item xs>
          <Form.Group
            controlId="formGroupLastName"
            style={
              props.signup
                ? {
                    display: `block`,
                    margin: `0`,
                  }
                : {
                    display: `none`,
                  }
            }
          >
            <Form.Label className={classes.preAuthFieldLabel}>
              Last Name
            </Form.Label>
            <InputGroup>
              <Form.Control
                required={props.signup}
                type="text"
                placeholder="Doe"
                autoComplete="off"
                className={clsx(classes.preAuthFormField, {
                  [classes.invalidField]: invalidLastName,
                })}
                onInput={input => {
                  setValidateForm(true)

                  if (input.target.value.length === 0) setInvalidLastName(true)
                  else {
                    setLastName(input.target.value)
                    setInvalidLastName(false)
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    triggerSubmitButtonClick()
                  }
                }}
              />
              <InputGroup.Append className={classes.append}>
                <InputGroup.Text
                  className={clsx(classes.preAuthAppend, {
                    [classes.invalidAppend]: invalidLastName,
                  })}
                >
                  <FiUsers />
                </InputGroup.Text>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">
                <Flip top opposite>
                  Last Name is required.
                </Flip>
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Grid>
      </Grid>
      <Form.Group
        controlId="formGroupEmail"
        style={
          props.signup
            ? {
                display: `block`,
                margin: `0`,
              }
            : {}
        }
      >
        <Form.Label className={classes.preAuthFieldLabel}>Email</Form.Label>
        <InputGroup>
          <Form.Control
            required
            type="email"
            placeholder="sample@email.com"
            autoComplete="off"
            className={clsx(classes.preAuthFormField, {
              [classes.invalidField]: invalidEmail,
            })}
            onInput={input => {
              setValidateForm(true)

              if (
                input.target.value.length === 0 ||
                !isValidEmail(input.target.value)
              )
                setInvalidEmail(true)
              else {
                setEmail(input.target.value)
                setInvalidEmail(false)
              }
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                triggerSubmitButtonClick()
              }
            }}
          />
          <InputGroup.Append className={classes.append}>
            <InputGroup.Text
              className={clsx([classes.preAuthAppend], {
                [classes.invalidAppend]: invalidEmail,
              })}
            >
              <FiMail />
            </InputGroup.Text>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            <Flip top opposite>
              Invalid email format.
            </Flip>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group
        controlId="formGroupPassword"
        style={
          props.forgot
            ? {
                display: `none`,
              }
            : {
                display: `block`,
                margin: `0`,
              }
        }
      >
        <Form.Label className={classes.preAuthFieldLabel}>Password</Form.Label>
        <InputGroup>
          <Form.Control
            required={props.forgot ? false : true}
            type={isPasswordHidden ? 'password' : 'text'}
            placeholder="At least 6 characters"
            autoComplete="off"
            minLength="6"
            className={clsx(classes.preAuthFormField, {
              [classes.invalidField]: invalidPassword,
            })}
            onInput={input => {
              setValidateForm(true)
              if (!isValidPassword(input.target.value)) setInvalidPassword(true)
              else {
                setPassword(input.target.value)
                setInvalidPassword(false)
              }
            }}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                triggerSubmitButtonClick()
              }
            }}
          />
          <InputGroup.Append className={clsx('change__cursor', classes.append)}>
            <InputGroup.Text
              className={clsx(classes.preAuthAppend, {
                [classes.invalidAppend]: invalidPassword,
              })}
              onClick={() => {
                setIsPasswordHidden(!isPasswordHidden)
              }}
            >
              {isPasswordHidden ? <FiEyeOff /> : <FiEye />}
            </InputGroup.Text>
          </InputGroup.Append>
          <Form.Control.Feedback type="invalid">
            <Flip top opposite>
              Password must be at least 6 characters in length.
            </Flip>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <ForgotPassword showForgot={props.showForgot} />
      <br />
      <SubmitButton
        ref={submitButton}
        button={props.button}
        firstName={firstName}
        lastName={lastName}
        name={firstName + ' ' + lastName}
        email={email}
        password={password}
        disable={setDisableValue}
      />
      <hr className="hr-text" style={{ margin: `5px` }} />
      <Grid
        container
        spacing={5}
        style={{
          fontWeight: `300`,
          fontSize: `15px`,
          color: `#626262`,
        }}
      >
        <Grid
          item
          xs
          style={{
            textAlign: `right`,
          }}
        >
          {props.message}
        </Grid>
        <Grid item xs>
          <AniLink
            cover
            direction="up"
            duration={1.5}
            bg="#fff"
            to={props.link}
            style={{
              color: `#146acc`,
              textAlign: `left`,
              fontWeight: `600`,
            }}
          >
            {props.linkName} Now
          </AniLink>
        </Grid>
      </Grid>
    </Form>
  )
}

export const SubmitButton = React.forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar()
  const button = props.button
  const [showModal, setShowModal] = React.useState(false)
  const [modalTitle, setModalTitle] = React.useState(null)
  const [modalBody, setModalBody] = React.useState(null)

  async function signUpHandler() {
    const firstName = props.firstName
    const lastName = props.lastName
    const name = props.name
    const email = props.email
    const password = props.password

    const params = {
      url: '/auth/signup' + connectPathParam,
      method: 'post',
      data: {
        name: name,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      },
    }

    firstName !== '' &&
    lastName !== '' &&
    name !== '' &&
    email !== '' &&
    password !== ''
      ? isValidEmail(email)
        ? isValidPassword(password)
          ? await axios(params)
              .then(response => {
                switch (response.status) {
                  case 201:
                    switch (response.data.status) {
                      case 'success':
                        setShowModal(!showModal)
                        setModalTitle('VERIFY YOUR EMAIL')
                        setModalBody(setModalBodySignUp())
                        break
                      default:
                        return ''
                    }
                    break
                  default:
                    return ''
                }
              })
              .catch(error => {
                switch (error.response.status) {
                  case 500:
                    enqueueSnackbar('Email is already in use.', {
                      variant: 'error',
                    })
                    break
                  default:
                    enqueueSnackbar('Server error.', {
                      variant: 'error',
                    })
                    break
                }
              })
          : () => {
              enqueueSnackbar(
                'Password must be at least 6 characters in length.',
                {
                  variant: 'error',
                }
              )
            }
        : () => {
            enqueueSnackbar('Email format is not valid.', {
              variant: 'error',
            })
          }
      : () => {
          enqueueSnackbar('Required fields are empty.', {
            variant: 'error',
          })
        }
  }

  async function loginHandler() {
    const email = props.email
    const password = props.password

    const params = {
      url: '/auth/login' + connectPathParam,
      method: 'post',
      data: {
        email: email,
        password: password,
      },
    }

    email !== '' && password !== ''
      ? isValidEmail(email)
        ? isValidPassword(password)
          ? await axios(params)
              .then(response => {
                switch (response.status) {
                  case 200:
                    switch (response.data.status) {
                      case 'success':
                        enqueueSnackbar(
                          "Please wait while we logged you in. Let's have great memories!",
                          {
                            variant: 'success',
                          }
                        )
                        setTimeout(() => {
                          handleUserAuth(response)
                        }, 1500)
                        break
                      default:
                        enqueueSnackbar('Incorrect Email and/or Password.', {
                          variant: 'error',
                        })
                        break
                    }
                }
              })
              .catch(error => {
                switch (error.response.status) {
                  case 422:
                    enqueueSnackbar(error.response.data.error.errors.email[0], {
                      variant: 'error',
                    })
                    break
                  case 404:
                    enqueueSnackbar('Incorrect Email and/or Password.', {
                      variant: 'error',
                    })
                    break
                  default:
                    enqueueSnackbar('Server error.', {
                      variant: 'error',
                    })
                    break
                }
              })
          : () => {
              enqueueSnackbar(
                'Password must be at least 6 characters in length.',
                {
                  variant: 'error',
                }
              )
            }
        : () => {
            enqueueSnackbar('Email format is not valid.', {
              variant: 'error',
            })
          }
      : () => {
          enqueueSnackbar('Email and/or Password is empty.', {
            variant: 'error',
          })
        }
  }

  async function resetHandler() {
    const email = props.email

    const params = {
      url: '/auth/recovery' + connectPathParam,
      method: 'post',
      data: {
        email: email,
      },
    }

    email !== ''
      ? isValidEmail(email)
        ? await axios(params)
            .then(response => {
              switch (response.status) {
                case 200:
                  enqueueSnackbar('Email has been sent to ' + email, {
                    variant: 'success',
                  })
                  break
                default:
                  return ''
              }
            })
            .catch(error => {
              switch (error.response.status) {
                case 422:
                  enqueueSnackbar(error.response.data.error.errors.email[0], {
                    variant: 'error',
                  })
                  break
                case 404:
                  enqueueSnackbar(
                    'You gave us an email that is not yet in our records.',
                    {
                      variant: 'error',
                    }
                  )
                  break
                default:
                  enqueueSnackbar('Server Error', {
                    variant: 'error',
                  })
                  break
              }
            })
        : () => {
            enqueueSnackbar('Email format is not valid.', {
              variant: 'error',
            })
          }
      : () => {
          enqueueSnackbar('Email field is empty.', {
            variant: 'error',
          })
        }
  }

  function setButtonFunc(button) {
    switch (button) {
      case 'SIGN UP':
        return signUpHandler()
      case 'LOG IN':
        return loginHandler()
      case 'RESET PASSWORD':
        return resetHandler()
      default:
        return null
    }
  }

  function setModalBodySignUp() {
    return (
      <Fragment>
        <p>
          To complete your sign up, we have sent you a verification link to your
          <b> email</b>.
        </p>
        <p>The provided link will automatically log you in.</p>
        <ResendCountdown />
      </Fragment>
    )
  }

  function handleHideModal() {
    setShowModal(!showModal)
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Button
            ref={ref}
            fullWidth={true}
            onClick={() => setButtonFunc(button)}
            style={{
              paddingTop: `5px`,
              paddingBottom: `5px`,
              fontWeight: `500`,
              fontFamily: `Open Sans`,
              backgroundColor: `#8DB6D9`,
              border: `1px solid #8DB6D9`,
              color: `#012B58`,
              fontSize: `1rem`,
            }}
          >
            {button}
          </Button>
        </Grid>
      </Grid>
      <ModalNotification
        show={showModal}
        heading={modalTitle}
        message={modalBody}
        handleHideModal={handleHideModal.bind(this)}
      />
    </Fragment>
  )
})
