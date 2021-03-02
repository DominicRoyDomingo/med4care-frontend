{
  /*
   * questionHistoryTable.js
   *
   * Component for tabular view in Question History
   *
   * Author: Dominic Domingo
   * Created: 12/30/2019
   *
   */
}

import React from 'react'
import { Grid, makeStyles, Paper } from '@material-ui/core'
import {
  MdAddBox,
  MdArrowDownward,
  MdCheck,
  MdChevronLeft,
  MdChevronRight,
  MdClear,
  MdDelete,
  MdEdit,
  MdFilterList,
  MdFirstPage,
  MdLastPage,
  MdRemove,
  MdCloudDownload,
  MdSearch,
  MdViewColumn,
  MdRotateLeft,
  MdNotInterested,
} from 'react-icons/md'
import MaterialTable, { MTableActions } from 'material-table'
import { getUserDetails } from '../../../utils/auth'
import QuestionHistoryTableMobile from './questionHistoryTableMobile'
import dateformat from 'dateformat'
import fetch from 'isomorphic-fetch'

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
  exportBtn: {
    fontSize: '0.7em',
    padding: '0 20px',
  },
  exportBtnText: {
    margin: theme.spacing(1),
  },
}))

export default function QuestionHistoryTable(props) {
  const classes = useStyles()
  const [isLoading, setIsLoading] = React.useState(true)
  const [hideActions, setHideActions] = React.useState(true)
  const [assignedQuestions, setAssignedQuestions] = React.useState(new Array())

  const columns = [
    {
      field: 'AssignedQuestionId',
      title: 'Action',
      hidden: true,
    },
    {
      title: "Doctor's Name",
      field: 'DoctorName',
      cellStyle: { paddingLeft: '20px' },
    },
    {
      title: "Patient's Name",
      field: 'PatientName',
      cellStyle: { paddingLeft: '20px' },
    },
    {
      title: 'Question',
      field: 'Question',
      cellStyle: { fontWeight: 'bold', paddingLeft: '20px' },
    },
    { title: 'Answer', field: 'Answer', cellStyle: { paddingLeft: '20px' } },
    {
      title: 'Date Answered',
      field: 'DateAnswered',
      type: 'date',
      cellStyle: { paddingLeft: '20px' },
    },
    {
      title: 'Date Assigned',
      field: 'DateAssigned',
      type: 'date',
      cellStyle: { paddingLeft: '20px' },
    },
    {
      title: 'Status',
      field: 'Status',
      lookup: {
        Open: 'Open',
        Answered: 'Answered',
        Reopen: 'Reopen',
        Closed: 'Closed',
      },
      cellStyle: rowData =>
        rowData === 'Answered'
          ? {
              color: 'green',
              paddingLeft: '20px',
              backgroundColor: '#d3edd3',
            }
          : rowData === 'Reopen'
          ? {
              color: '#FFAA0F',
              paddingLeft: '20px',
              backgroundColor: '#fff1db',
            }
          : rowData === 'Open'
          ? { color: 'gray', paddingLeft: '20px', backgroundColor: '#e2e2e2' }
          : { color: 'black', paddingLeft: '20px', backgroundColor: '#939393' },
    },
  ]

  const tableIcons = {
    Add: React.forwardRef((props, ref) => <MdAddBox {...props} ref={ref} />),
    Check: React.forwardRef((props, ref) => <MdCheck {...props} ref={ref} />),
    Clear: React.forwardRef((props, ref) => <MdClear {...props} ref={ref} />),
    Delete: React.forwardRef((props, ref) => <MdDelete {...props} ref={ref} />),
    DetailPanel: React.forwardRef((props, ref) => (
      <MdChevronRight {...props} ref={ref} />
    )),
    Edit: React.forwardRef((props, ref) => <MdEdit {...props} ref={ref} />),
    Export: React.forwardRef((props, ref) => (
      <div className={classes.exportBtn}>
        <MdCloudDownload {...props} ref={ref} />
        <span className={classes.exportBtnText}>Export</span>
      </div>
    )),
    Filter: React.forwardRef((props, ref) => (
      <MdFilterList {...props} ref={ref} />
    )),
    FirstPage: React.forwardRef((props, ref) => (
      <MdFirstPage {...props} ref={ref} />
    )),
    LastPage: React.forwardRef((props, ref) => (
      <MdLastPage {...props} ref={ref} />
    )),
    NextPage: React.forwardRef((props, ref) => (
      <MdChevronRight {...props} ref={ref} />
    )),
    PreviousPage: React.forwardRef((props, ref) => (
      <MdChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: React.forwardRef((props, ref) => (
      <MdClear {...props} ref={ref} />
    )),
    Search: React.forwardRef((props, ref) => <MdSearch {...props} ref={ref} />),
    SortArrow: React.forwardRef((props, ref) => (
      <MdArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: React.forwardRef((props, ref) => (
      <MdRemove {...props} ref={ref} />
    )),
    ViewColumn: React.forwardRef((props, ref) => (
      <MdViewColumn {...props} ref={ref} />
    )),
  }

  const handleStatusChange = (assigned_question_id, new_status) => {
    setIsLoading(true)

    fetch(
      appURL +
        'api/auth/admin/questions/assigned/change_status/' +
        assigned_question_id +
        patientParam +
        '&api_token=' +
        getUserDetails('token') +
        '&status=' +
        new_status
    ).then(() => {
      props.getAssignedQuestions()
      getAssignedQuestions()
      setHideActions(props.hideActions)
      setIsLoading(props.isLoading)
    })
  }

  const getAssignedQuestions = () => {
    const dataSet = props.assignedIdList.flatMap(id => [
      {
        AssignedQuestionId: id.assigned_id,
        DoctorName: getUserDetails('is_patient')
          ? props.assignedQuestionSet.filter(
              assigned => assigned.id === id.assigned_id
            )[0].doctor !== undefined
            ? props.assignedQuestionSet.filter(
                assigned => assigned.id === id.assigned_id
              )[0].doctor.first_name +
              ' ' +
              props.assignedQuestionSet.filter(
                assigned => assigned.id === id.assigned_id
              )[0].doctor.last_name
            : null
          : getUserDetails('name'),
        PatientName:
          props.assignedQuestionSet.filter(
            assigned => assigned.id === id.assigned_id
          )[0].relationships.patient.first_name +
          ' ' +
          props.assignedQuestionSet.filter(
            assigned => assigned.id === id.assigned_id
          )[0].relationships.patient.sur_name,
        Question: props.questionList.filter(
          questions => questions.id === id.question_id
        )[0].question,
        Answer:
          props.answeredList.filter(
            answers =>
              answers.attributes.assigned_question_id === id.assigned_id
          )[0] !== undefined
            ? props.answeredList.filter(
                answers =>
                  answers.attributes.assigned_question_id === id.assigned_id
              )[0].attributes.answer
            : '',
        DateAnswered: dateformat(
          new Date(
            props.assignedQuestionSet
              .filter(assigned => assigned.id === id.assigned_id)[0]
              .attributes.last_answered.replace(/-/g, '//')
          ),
          'mmm dd, yyyy hh:MM:ss tt'
        ).toString(),
        DateAssigned: dateformat(
          new Date(
            props.assignedQuestionSet
              .filter(assigned => assigned.id === id.assigned_id)[0]
              .attributes.assign_date.replace(/-/g, '//') +
              ' ' +
              props.assignedQuestionSet.filter(
                assigned => assigned.id === id.assigned_id
              )[0].attributes.assign_time
          ),
          'mmm dd, yyyy hh:MM:ss tt'
        ).toString(),
        Status: props.assignedQuestionSet.filter(
          assigned => assigned.id === id.assigned_id
        )[0].attributes.status,
      },
    ])

    setAssignedQuestions(dataSet)
  }

  React.useEffect(() => {
    getAssignedQuestions()
    setIsLoading(props.isLoading)
    setHideActions(props.hideActions)
  }, [props])

  return (
    <Grid container>
      <MaterialTable
        title="Question History Table"
        icons={tableIcons}
        columns={columns}
        data={assignedQuestions}
        actions={[
          rowData => ({
            icon: React.forwardRef((prop, ref) => (
              <MdRotateLeft
                {...prop}
                ref={ref}
                style={
                  rowData.Status === 'Answered'
                    ? { color: `orange` }
                    : { color: `#e9e9e9` }
                }
              />
            )),
            tooltip: 'Re-open Question',
            onClick: (event, rowData) => {
              handleStatusChange(rowData.AssignedQuestionId, 'Reopen')
            },
            hidden: hideActions,
            disabled: rowData.Status !== 'Answered',
          }),
          rowData => ({
            icon: React.forwardRef((prop, ref) => (
              <MdNotInterested
                {...prop}
                ref={ref}
                style={
                  rowData.Status === 'Answered'
                    ? { color: `red` }
                    : { color: `#e9e9e9` }
                }
              />
            )),
            tooltip: 'Close Question',
            onClick: (event, rowData) => {
              handleStatusChange(rowData.AssignedQuestionId, 'Closed')
            },
            hidden: hideActions,
            disabled: rowData.Status !== 'Answered',
          }),
        ]}
        options={{
          tableLayout: 'fixed',
          doubleHorizontalScroll: true,
          grouping: true,
          filtering: !hideActions,
          exportButton: true,
          showTitle: false,
          headerStyle: {
            backgroundColor: '#8db6d9',
            color: '#012b58',
            padding: '20px',
          },
          filterCellStyle: {
            backgroundColor: '#fafafa',
            padding: '20px',
          },
          rowStyle: {
            backgroundColor: '#fff',
            paddingLeft: '10px',
          },
          actionsCellStyle: {
            visibility: hideActions ? 'hidden' : 'visible',
          },
          actionsColumnIndex: hideActions ? -2 : 0,
        }}
        localization={
          hideActions
            ? {
                body: {
                  filterRow: {
                    filterTooltip: 'Type to filter',
                  },
                },
                header: {
                  actions: null,
                },
                toolbar: {
                  searchPlaceholder: 'Search all columns',
                  exportName: 'Export All Data',
                },
              }
            : {
                body: {
                  filterRow: {
                    filterTooltip: 'Type to filter',
                  },
                },
                header: {
                  actions: 'Change Status',
                },
                toolbar: {
                  searchPlaceholder: 'Search all columns',
                  exportName: 'Export All Data',
                },
              }
        }
        isLoading={isLoading}
        style={{ fontSize: `0.9em`, backgroundColor: `rgba(255,255,255, 0)` }}
        components={{
          Actions: props => (
            <div style={{ width: `100%`, marginLeft: `10%` }}>
              <MTableActions {...props} />
            </div>
          ),
          Container: props => (
            <Paper
              {...props}
              style={{
                borderRadius: 0,
                margin: 'auto',
              }}
              className="question-history__table"
            />
          ),
        }}
      />
      <QuestionHistoryTableMobile
        header={columns}
        assignedquestions={assignedQuestions}
        handleStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </Grid>
  )
}
