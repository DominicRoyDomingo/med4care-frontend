{
  /*
   * auth.js
   *
   * Re-usable code for authentication
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

import { navigate } from 'gatsby'
import faker from 'faker'
import axios from '../../presets/axios'
import fetch from 'isomorphic-fetch'
const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

let inMemory = ''
let interval = ''
let appBaseURL = process.env.APP_URL
const appURL =
  appBaseURL.slice(appBaseURL.length - 1) === '/'
    ? appBaseURL
    : appBaseURL + '/'

const setUser = userDetails => {
  userDetails != {}
    ? (localStorage.userAuth = JSON.stringify(userDetails))
    : localStorage.removeItem('userAuth')
}

export const getUser = () =>
  localStorage.userAuth ? JSON.parse(localStorage.userAuth) : null

const redirectBackend = props => {
  if (props.data.has_backend_access) {
    localStorage.removeItem('userAuth')
    location.replace(
      process.env.HAS_BACKEND_ACCESS_URL + '?api_token=' + props.data.token
    )
  }
}

export function handleUserAuth({ ...props }, noRedirect) {
  const date = new Date()

  fetch(
    appURL +
      'api/auth/admin/patients?path=' +
      process.env.PATIENT_PATH_URL +
      '&api_token=' +
      props.data.token
  )
    .then(response => response.json())
    .then(json => {
      inMemory = {
        first_name: props.data.user.first_name,
        last_name: props.data.user.last_name,
        name: props.data.user.first_name + ' ' + props.data.user.last_name,
        email: props.data.user.email,
        token: props.data.token,
        image: faker.image.avatar(),
        user_id: props.data.user.id,
        expires_in: props.data.expires_in,
        has_backend_access: props.data.has_backend_access,
        login_date: date,
        is_patient:
          json.data.filter(
            patient =>
              patient.type.toLowerCase() === 'patient' &&
              patient.attributes.email.toLowerCase() ===
                props.data.user.email.toLowerCase()
          ).length === 0
            ? false
            : true,
        patient_id: json.data
          .filter(
            patient =>
              patient.type.toLowerCase() === 'patient' &&
              patient.attributes.email.toLowerCase() ===
                props.data.user.email.toLowerCase()
          )
          .map(patient => patient.id)[0],
        token_expires: date.setMinutes(
          date.getMinutes() + props.data.expires_in * 1000
        ),
      }

      setUser(inMemory)

      const expires_in = new Date() + inMemory.expires_in * 1000

      interval = setInterval(() => {
        if (new Date() >= expires_in) {
          navigate('/logout')
        }
      }, 1000)

      redirectBackend(props)

      if (!noRedirect) {
        navigate('/home')
      }
    })
  return true
}

export function isLoggedIn() {
  fetch(
    appURL +
      'api/auth/me?path=' +
      process.env.AUTH_PATH +
      '&token=' +
      getUserDetails('token')
  ).then(response =>
    response.status !== 200 || !localStorage.userAuth ? navigate('/expire') : {}
  )
}

export function getUserDetails(type) {
  const user = getUser()

  if (localStorage.userAuth === undefined) {
    navigate('/login')
  } else {
    switch (type) {
      case 'name':
        return user.name
      case 'first_name':
        return user.first_name
      case 'last_name':
        return user.last_name
      case 'email':
        return user.email
      case 'token':
        return user.token
      case 'image':
        return user.image
      case 'user_id':
        return user.user_id
      case 'expires_in':
        return user.expires_in
      case 'is_patient':
        return user.is_patient
      case 'patient_id':
        return user.patient_id
      case 'has_backend_access':
        return user.has_backend_access
      default:
        return null
    }
  }
}

export function logout() {
  const logoutParams = {
    url: '/auth/logout?path=' + process.env.AUTH_PATH,
    method: 'post',
    data: {
      token: JSON.parse(localStorage.userAuth).token,
    },
  }

  axios(logoutParams).finally(() => {
    clearInterval(interval)
    setUser({})
    localStorage.removeItem('userAuth')

    setTimeout(() => {
      navigate('/login')
    }, 1500)
  })
}
