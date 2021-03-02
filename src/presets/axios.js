import axios from 'axios'
const activeEnv = process.env.NODE_ENV || 'development'
require('dotenv').config({
  path: `.env.${activeEnv}`,
})

let appBaseURL = process.env.APP_URL
const appURL =
  appBaseURL.slice(appBaseURL.length - 1) === '/'
    ? appBaseURL
    : appBaseURL + '/'

axios.defaults['baseURL'] = appURL + 'api/'
axios.defaults.headers.common[
  'Content-Type'
] = `application/x-www-form-urlencoded`
axios.defaults.headers.common['Accept'] = `*/*`
axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`

export default axios
