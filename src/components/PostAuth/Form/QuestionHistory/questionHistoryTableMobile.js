{
  /*
   * questionHistoryTableMobile.js
   *
   * Responsive tabular view for Question History
   *
   * Author: Dominic Domingo
   * Created: 04/2020
   *
   */
}

import React, { Fragment } from 'react'
import { makeStyles, IconButton, Tooltip } from '@material-ui/core'
import { MdRotateLeft, MdNotInterested } from 'react-icons/md'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import clsx from 'clsx'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { getUserDetails } from '../../../utils/auth'
import Spinner from '../../../utils/spinner'

const useStyles = makeStyles(theme => ({
  mobileTable: {
    display: 'none',
    backgroundColor: '#f9f9f9',
    fontSize: '0.99em',
  },
  openStatus: {
    color: 'gray',
    backgroundColor: '#E2E2E2',
  },
  answeredStatus: {
    color: 'green',
    backgroundColor: '#D3EDD3',
  },
  reopenStatus: {
    color: 'orange',
    backgroundColor: '#FFF1DB',
  },
  closedStatus: {
    color: 'black',
    backgroundColor: '#939393',
  },
}))

export default function QuestionHistoryTableMobile(props) {
  const classes = useStyles()

  return (
    <Fragment>
      <Spinner visible={props.isLoading} />
      <Table
        className={clsx(
          [classes.mobileTable],
          'question-history__table-mobile'
        )}
      >
        <Thead>
          <Tr>
            {props.header.map(header => (
              <Th>
                {getUserDetails('is_patient')
                  ? header.title === 'Action'
                    ? null
                    : header.title
                  : header.title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.assignedquestions.map(question => (
            <Tr>
              <Td>
                {!getUserDetails('is_patient') ? (
                  <Fragment>
                    <Tooltip title="Reopen Question">
                      <IconButton
                        color="primary"
                        disabled={question.Status !== 'Answered'}
                      >
                        <MdRotateLeft
                          onClick={() =>
                            props.handleStatusChange(
                              question.AssignedQuestionId,
                              'Reopen'
                            )
                          }
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Close Question">
                      <IconButton
                        color="secondary"
                        disabled={question.Status !== 'Answered'}
                      >
                        <MdNotInterested
                          onClick={() =>
                            props.handleStatusChange(
                              question.AssignedQuestionId,
                              'Closed'
                            )
                          }
                        />
                      </IconButton>
                    </Tooltip>
                  </Fragment>
                ) : (
                  <Fragment></Fragment>
                )}
              </Td>
              <Td>{question.DoctorName}</Td>
              <Td>{question.PatientName}</Td>
              <Td>
                <strong>{question.Question}</strong>
              </Td>
              <Td>{question.Answer}</Td>
              <Td>{question.DateAnswered}</Td>
              <Td>{question.DateAssigned}</Td>
              <Td
                className={clsx(
                  {
                    [classes.openStatus]: question.Status === 'Open',
                  },
                  {
                    [classes.answeredStatus]: question.Status === 'Answered',
                  },
                  {
                    [classes.reopenStatus]: question.Status === 'Reopen',
                  },
                  {
                    [classes.closedStatus]: question.Status === 'Closed',
                  }
                )}
              >
                {question.Status}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Fragment>
  )
}
