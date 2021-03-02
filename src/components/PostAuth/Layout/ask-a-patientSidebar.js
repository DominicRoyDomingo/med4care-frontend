{
  /*
   * ask-a-patientSidebar.js
   *
   * SideBar Component for Ask A Patient
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap'
import {
  IoIosMail,
  IoIosPaperPlane,
  IoMdCreate,
  IoMdTrash,
} from 'react-icons/io'

class AskAPatientSidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Fragment>
        <div className="main-content__sidebar">
          <Button variant="success" className="main-content__button">
            Ask a Patient
          </Button>
          <hr />
          <div className="main-content__link">
            <IoIosMail className="main-content__icon" />
            <span className="main-content__link-name">Inbox</span>
          </div>
          <div className="main-content__link">
            <IoIosPaperPlane className="main-content__icon" />
            <span className="main-content__link-name">Sent</span>
          </div>
          <div className="main-content__link">
            <IoMdCreate className="main-content__icon" />
            <span className="main-content__link-name">Drafts</span>
          </div>
          <div className="main-content__link">
            <IoMdTrash className="main-content__icon" />
            <span className="main-content__link-name">Trash</span>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default AskAPatientSidebar
