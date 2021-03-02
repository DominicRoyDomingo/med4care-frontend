{
  /*
   * tabSelection.js
   *
   * Navigational Tab component for switching between
   * Questionnaires and Questions selections
   *
   * Author: Dominic Domingo
   * Created: 01/14/2020
   *
   */
}

import React from 'react'
import {
  makeStyles,
  useTheme,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core'
import { MdQuestionAnswer } from 'react-icons/md'
import { AiFillQuestionCircle } from 'react-icons/ai'
import PropTypes from 'prop-types'
import QuestionnaireSelection from './questionnaireSelection'
import QuestionSelection from './questionSelection'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: `rgba(0,0,0,0)`,
    margin: '0 -45px',
  },
  tabPanel: {
    padding: '0 30px',
  },
}))

export default function TabSelection(props) {
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab
            label="Questionnaires"
            icon={<MdQuestionAnswer />}
            {...a11yProps(0)}
          />
          <Tab
            label="Questions"
            icon={<AiFillQuestionCircle />}
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel
        value={value}
        index={0}
        dir={theme.direction}
        className={classes.tabPanel}
      >
        <QuestionnaireSelection
          patientsemail={props.patientsemail}
          emailsubject={props.emailsubject}
          doctorsemail={props.doctorsemail}
        />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
        dir={theme.direction}
        className={classes.tabPanel}
      >
        <QuestionSelection
          patientsemail={props.patientsemail}
          emailsubject={props.emailsubject}
          doctorsemail={props.doctorsemail}
        />
      </TabPanel>
    </div>
  )
}
