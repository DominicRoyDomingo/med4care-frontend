{
  /*
   * sidenavbar.js
   *
   * Sidebar component for post-authenticated screens
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

import React, { Fragment } from 'react'
import { Tooltip } from '@material-ui/core'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FiInbox, FiShield } from 'react-icons/fi'
import { GiConversation } from 'react-icons/gi'
import { MdDashboard } from 'react-icons/md'
import {
  FaInfoCircle,
  FaHeadset,
  FaRegQuestionCircle,
  FaRuler,
  FaProcedures,
} from 'react-icons/fa'
import { AiOutlinePoweroff, AiOutlineHistory } from 'react-icons/ai'
import { getUserDetails } from '../../utils/auth'
import clsx from 'clsx'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import logo from '../../../images/logo.png'

class Sidenavbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDashboardLinkVisible: false,
      isPatInfoLinkVisible: false,
      activeLink: this.props.activeLink,
      isPatient: true,
    }
    this.toggleDashboardLinks = this.toggleDashboardLinks.bind(this)
    this.togglePatInfoLinks = this.togglePatInfoLinks.bind(this)
  }

  toggleDashboardLinks() {
    this.setState({
      isDashboardLinkVisible: !this.state.isDashboardLinkVisible,
      isPatInfoLinkVisible: false,
    })
  }

  togglePatInfoLinks() {
    this.setState({
      isPatInfoLinkVisible: !this.state.isPatInfoLinkVisible,
      isDashboardLinkVisible: false,
    })
  }

  componentDidMount() {
    this.setState({
      isPatient: getUserDetails('is_patient'),
    })

    this.props.activeLink == 'mailbox' ||
    this.props.activeLink == 'ask-a-patient'
      ? this.setState({
          isDashboardLinkVisible: true,
        })
      : this.setState({
          isDashboardLinkVisible: false,
        })

    this.props.activeLink == 'privacy-policy' ||
    this.props.activeLink == 'questionnaires' ||
    this.props.activeLink == 'question-history'
      ? this.setState({
          isPatInfoLinkVisible: true,
        })
      : this.setState({
          isPatInfoLinkVisible: false,
        })
  }

  componentWillUnmount() {
    this.setState({
      activeLink: null,
      isPatInfoLinkVisible: false,
      isDashboardLinkVisible: false,
    })
  }

  getSidebar() {
    const isVisible = this.props.isVisible
    const isPatient = this.state.isPatient

    return (
      <Fragment>
        <ul className={clsx('sidebar', { sidebar__min: !isVisible })}>
          <AniLink
            fade
            to="/home"
            onClick={() => {
              this.setState({
                activeLink: 'home',
              })
              this.props.setActiveLink('home')
            }}
          >
            {isVisible ? (
              <img src={logo} alt="logo" id="sidebar__logo" />
            ) : (
              <Tooltip title="Home" arrow placement="right">
                <img src={logo} alt="logo" id="sidebar__logo" />
              </Tooltip>
            )}
          </AniLink>
          <hr className="sidebar__hr" />
          {isVisible ? (
            <li
              className="sidebar__link"
              onClick={this.toggleDashboardLinks}
              style={
                this.state.isDashboardLinkVisible
                  ? { fontWeight: `bold` }
                  : { fontWeight: `500` }
              }
            >
              <MdDashboard
                className="sidebar__icon"
                style={
                  this.state.isDashboardLinkVisible
                    ? { color: `#000` }
                    : { color: `#707070` }
                }
              />
              <span className="sidebar__link-name">
                Dashboard{' '}
                {this.state.isDashboardLinkVisible ? (
                  <IoIosArrowUp className="sidebar__link-arrow" />
                ) : (
                  <IoIosArrowDown className="sidebar__link-arrow" />
                )}
              </span>
            </li>
          ) : (
            <Tooltip title="Dashboard" arrow placement="right">
              <li
                className="sidebar__link"
                onClick={this.toggleDashboardLinks}
                style={
                  this.state.isDashboardLinkVisible
                    ? { fontWeight: `bold` }
                    : { fontWeight: `500` }
                }
              >
                <MdDashboard
                  className="sidebar__icon"
                  style={
                    this.state.isDashboardLinkVisible
                      ? { color: `#000` }
                      : { color: `#707070` }
                  }
                />
                <span className="sidebar__link-name">
                  Dashboard{' '}
                  {this.state.isDashboardLinkVisible ? (
                    <IoIosArrowUp className="sidebar__link-arrow" />
                  ) : (
                    <IoIosArrowDown className="sidebar__link-arrow" />
                  )}
                </span>
              </li>
            </Tooltip>
          )}
          {this.state.isDashboardLinkVisible ? (
            <ul
              id="sidebar__inner-dashboard-link"
              className="sidebar__inner-link-container"
            >
              <AniLink
                fade
                to="/mailbox"
                onClick={() => {
                  this.setState({
                    activeLink: 'mailbox',
                  })
                  this.props.setActiveLink('mailbox')
                }}
              >
                {isVisible ? (
                  <li
                    className="sidebar__inner-link"
                    id="sidebar__link-mailbox"
                    style={
                      this.props.activeLink == 'mailbox'
                        ? {
                            backgroundColor: `#8db6d9`,
                            borderRight: `5px solid #3eb5c7`,
                          }
                        : {}
                    }
                  >
                    <FiInbox
                      className="sidebar__inner-icon"
                      style={
                        this.props.activeLink == 'mailbox'
                          ? { color: `#012b58` }
                          : { color: `#707070` }
                      }
                    />
                    <span
                      className="sidebar__inner-link-name"
                      style={
                        this.props.activeLink == 'mailbox'
                          ? { fontWeight: `bold`, color: `#012b58` }
                          : { fontWeight: `500` }
                      }
                    >
                      Mailbox
                    </span>
                  </li>
                ) : (
                  <Tooltip title="Mailbox" arrow placement="right">
                    <li
                      className="sidebar__inner-link"
                      id="sidebar__link-mailbox"
                      style={
                        this.props.activeLink == 'mailbox'
                          ? {
                              backgroundColor: `#8db6d9`,
                              borderRight: `5px solid #3eb5c7`,
                            }
                          : {}
                      }
                    >
                      <FiInbox
                        className="sidebar__inner-icon"
                        style={
                          this.props.activeLink == 'mailbox'
                            ? { color: `#012b58` }
                            : { color: `#707070` }
                        }
                      />
                      <span
                        className="sidebar__inner-link-name"
                        style={
                          this.props.activeLink == 'mailbox'
                            ? { fontWeight: `bold` }
                            : { fontWeight: `500` }
                        }
                      >
                        Mailbox
                      </span>
                    </li>
                  </Tooltip>
                )}
              </AniLink>
              {!isPatient ? (
                <AniLink
                  fade
                  to="/ask-a-patient"
                  onClick={() => {
                    this.setState({
                      activeLink: 'ask-a-patient',
                    })
                    this.props.setActiveLink('ask-a-patient')
                  }}
                >
                  {isVisible ? (
                    <li
                      className="sidebar__inner-link"
                      id="sidebar__link-ask-a-patient"
                      style={
                        this.props.activeLink == 'ask-a-patient'
                          ? {
                              backgroundColor: `#8db6d9`,
                              borderRight: `5px solid #3eb5c7`,
                            }
                          : {}
                      }
                    >
                      <FaRegQuestionCircle
                        style={
                          this.props.activeLink == 'ask-a-patient'
                            ? { color: `#012b58` }
                            : { color: `#707070` }
                        }
                        className="sidebar__inner-icon"
                      />
                      <span
                        className="sidebar__inner-link-name"
                        style={
                          this.props.activeLink == 'ask-a-patient'
                            ? { fontWeight: `bold`, color: `#012b58` }
                            : { fontWeight: `500` }
                        }
                      >
                        Ask a Patient
                      </span>
                    </li>
                  ) : (
                    <Tooltip title="Ask a Patient" arrow placement="right">
                      <li
                        className="sidebar__inner-link"
                        id="sidebar__link-ask-a-patient"
                        style={
                          this.props.activeLink == 'ask-a-patient'
                            ? {
                                backgroundColor: `#8db6d9`,
                                borderRight: `5px solid #3eb5c7`,
                              }
                            : {}
                        }
                      >
                        <FaRegQuestionCircle
                          style={
                            this.props.activeLink == 'ask-a-patient'
                              ? { color: `#012b58` }
                              : { color: `#707070` }
                          }
                          className="sidebar__inner-icon"
                        />
                        <span
                          className="sidebar__inner-link-name"
                          style={
                            this.props.activeLink == 'ask-a-patient'
                              ? { fontWeight: `bold` }
                              : { fontWeight: `500` }
                          }
                        >
                          Ask a Patient
                        </span>
                      </li>
                    </Tooltip>
                  )}
                </AniLink>
              ) : (
                <></>
              )}
            </ul>
          ) : (
            ''
          )}
          {isVisible ? (
            <li
              className="sidebar__link"
              onClick={this.togglePatInfoLinks}
              style={
                this.state.isPatInfoLinkVisible
                  ? { fontWeight: `bold` }
                  : { fontWeight: `500` }
              }
            >
              <FaInfoCircle
                className="sidebar__icon"
                style={
                  this.state.isPatInfoLinkVisible
                    ? { color: `#000` }
                    : { color: `#707070` }
                }
              />
              <span className="sidebar__link-name">
                Patient Information
                {this.state.isPatInfoLinkVisible ? (
                  <IoIosArrowUp className="sidebar__link-arrow" />
                ) : (
                  <IoIosArrowDown className="sidebar__link-arrow" />
                )}
              </span>
            </li>
          ) : (
            <Tooltip title="Patient Information" arrow placement="right">
              <li
                className="sidebar__link"
                onClick={this.togglePatInfoLinks}
                style={
                  this.state.isPatInfoLinkVisible
                    ? { fontWeight: `bold` }
                    : { fontWeight: `500` }
                }
              >
                <FaInfoCircle
                  className="sidebar__icon"
                  style={
                    this.state.isPatInfoLinkVisible
                      ? { color: `#000` }
                      : { color: `#707070` }
                  }
                />
                <span className="sidebar__link-name">
                  Patient Information
                  {this.state.isPatInfoLinkVisible ? (
                    <IoIosArrowUp className="sidebar__link-arrow" />
                  ) : (
                    <IoIosArrowDown className="sidebar__link-arrow" />
                  )}
                </span>
              </li>
            </Tooltip>
          )}
          {this.state.isPatInfoLinkVisible ? (
            <ul
              id="sidebar__inner-dashboard-link"
              className="sidebar__inner-link-container"
            >
              <AniLink
                fade
                to="/privacy-policy"
                onClick={() => {
                  this.setState({
                    activeLink: 'privacy-policy',
                  })
                  this.props.setActiveLink('privacy-policy')
                }}
              >
                {isVisible ? (
                  <li
                    className="sidebar__inner-link"
                    id="sidebar__link-privacy-policy"
                    style={
                      this.props.activeLink == 'privacy-policy'
                        ? {
                            backgroundColor: `#8db6d9`,
                            borderRight: `5px solid #3eb5c7`,
                          }
                        : {}
                    }
                  >
                    <FiShield
                      className="sidebar__inner-icon"
                      style={
                        this.props.activeLink == 'privacy-policy'
                          ? { color: `#012b58` }
                          : { color: `#707070` }
                      }
                    />
                    <span
                      className="sidebar__inner-link-name"
                      style={
                        this.props.activeLink == 'privacy-policy'
                          ? { fontWeight: `bold`, color: `#012b58` }
                          : { fontWeight: `500` }
                      }
                    >
                      Privacy Policy
                    </span>
                  </li>
                ) : (
                  <Tooltip title="Privacy Policy" arrow placement="right">
                    <li
                      className="sidebar__inner-link"
                      id="sidebar__link-privacy-policy"
                      style={
                        this.props.activeLink == 'privacy-policy'
                          ? {
                              backgroundColor: `#8db6d9`,
                              borderRight: `5px solid #3eb5c7`,
                            }
                          : {}
                      }
                    >
                      <FiShield
                        className="sidebar__inner-icon"
                        style={
                          this.props.activeLink == 'privacy-policy'
                            ? { color: `#012b58` }
                            : { color: `#707070` }
                        }
                      />
                      <span
                        className="sidebar__inner-link-name"
                        style={
                          this.props.activeLink == 'privacy-policy'
                            ? { fontWeight: `bold` }
                            : { fontWeight: `500` }
                        }
                      >
                        Privacy Policy
                      </span>
                    </li>
                  </Tooltip>
                )}
              </AniLink>
              {isPatient ? (
                <AniLink
                  fade
                  to="/questionnaires"
                  onClick={() => {
                    this.setState({
                      activeLink: 'questionnaires',
                    })
                    this.props.setActiveLink('questionnaires')
                  }}
                >
                  {isVisible ? (
                    <li
                      className="sidebar__inner-link"
                      id="sidebar__link-questionnaires"
                      style={
                        this.props.activeLink == 'questionnaires'
                          ? {
                              backgroundColor: `#8db6d9`,
                              borderRight: `5px solid #3eb5c7`,
                            }
                          : {}
                      }
                    >
                      <GiConversation
                        className="sidebar__inner-icon"
                        style={
                          this.props.activeLink == 'questionnaires'
                            ? { color: `#012b58` }
                            : { color: `#707070` }
                        }
                      />
                      <span
                        className="sidebar__inner-link-name"
                        style={
                          this.props.activeLink == 'questionnaires'
                            ? { fontWeight: `bold`, color: `#012b58` }
                            : { fontWeight: `500` }
                        }
                      >
                        Questionnaires
                      </span>
                    </li>
                  ) : (
                    <Tooltip title="Questionnaires" arrow placement="right">
                      <li
                        className="sidebar__inner-link"
                        id="sidebar__link-questionnaires"
                        style={
                          this.props.activeLink == 'questionnaires'
                            ? {
                                backgroundColor: `#8db6d9`,
                                borderRight: `5px solid #3eb5c7`,
                              }
                            : {}
                        }
                      >
                        <GiConversation
                          className="sidebar__inner-icon"
                          style={
                            this.props.activeLink == 'questionnaires'
                              ? { color: `#012b58` }
                              : { color: `#707070` }
                          }
                        />
                        <span
                          className="sidebar__inner-link-name"
                          style={
                            this.props.activeLink == 'questionnaires'
                              ? { fontWeight: `bold` }
                              : { fontWeight: `500` }
                          }
                        >
                          Questionnaires
                        </span>
                      </li>
                    </Tooltip>
                  )}
                </AniLink>
              ) : (
                <></>
              )}
              <AniLink
                fade
                to="/question-history"
                onClick={() => {
                  this.setState({
                    activeLink: 'question-history',
                  })
                  this.props.setActiveLink('question-history')
                }}
              >
                {isVisible ? (
                  <li
                    className="sidebar__inner-link"
                    id="sidebar__link-question-history"
                    style={
                      this.props.activeLink == 'question-history'
                        ? {
                            backgroundColor: `#8db6d9`,
                            borderRight: `5px solid #3eb5c7`,
                          }
                        : {}
                    }
                  >
                    <AiOutlineHistory
                      className="sidebar__inner-icon"
                      style={
                        this.props.activeLink == 'question-history'
                          ? { color: `#012b58` }
                          : { color: `#707070` }
                      }
                    />
                    <span
                      className="sidebar__inner-link-name"
                      style={
                        this.props.activeLink == 'question-history'
                          ? { fontWeight: `bold`, color: `#012b58` }
                          : { fontWeight: `500` }
                      }
                    >
                      Question History
                    </span>
                  </li>
                ) : (
                  <Tooltip title="Question History" arrow placement="right">
                    <li
                      className="sidebar__inner-link"
                      id="sidebar__link-question-history"
                      style={
                        this.props.activeLink == 'question-history'
                          ? {
                              backgroundColor: `#8db6d9`,
                              borderRight: `5px solid #3eb5c7`,
                            }
                          : {}
                      }
                    >
                      <AiOutlineHistory
                        className="sidebar__inner-icon"
                        style={
                          this.props.activeLink == 'question-history'
                            ? { color: `#012b58` }
                            : { color: `#707070` }
                        }
                      />
                      <span
                        className="sidebar__inner-link-name"
                        style={
                          this.props.activeLink == 'question-history'
                            ? { fontWeight: `bold`, color: `#012b58` }
                            : { fontWeight: `500` }
                        }
                      >
                        Question History
                      </span>
                    </li>
                  </Tooltip>
                )}
              </AniLink>
            </ul>
          ) : (
            ''
          )}
          {!isPatient ? (
            <AniLink
              fade
              to="/measurements"
              onClick={() => {
                this.setState({
                  activeLink: 'measurements',
                })
                this.props.setActiveLink('measurements')
              }}
            >
              {isVisible ? (
                <li
                  className="sidebar__link"
                  id="sidebar__link-measurements"
                  style={
                    this.props.activeLink == 'measurements'
                      ? {
                          backgroundColor: `#8db6d9`,
                          borderRight: `5px solid #3eb5c7`,
                        }
                      : {}
                  }
                >
                  <FaRuler
                    className="sidebar__icon"
                    style={
                      this.props.activeLink == 'measurements'
                        ? { color: `#012b58` }
                        : { color: `#707070` }
                    }
                  />
                  <span
                    className="sidebar__link-name"
                    style={
                      this.props.activeLink == 'measurements'
                        ? { fontWeight: `bold`, color: `#012b58` }
                        : { fontWeight: `500` }
                    }
                  >
                    Measurements
                  </span>
                </li>
              ) : (
                <Tooltip title="Measurements" arrow placement="right">
                  <li
                    className="sidebar__link"
                    id="sidebar__link-measurements"
                    style={
                      this.props.activeLink == 'measurements'
                        ? {
                            backgroundColor: `#8db6d9`,
                            borderRight: `5px solid #3eb5c7`,
                          }
                        : {}
                    }
                  >
                    <FaRuler
                      className="sidebar__icon"
                      style={
                        this.props.activeLink == 'measurements'
                          ? { color: `#012b58` }
                          : { color: `#707070` }
                      }
                    />
                    <span
                      className="sidebar__link-name"
                      style={
                        this.props.activeLink == 'measurements'
                          ? { fontWeight: `bold`, color: `#012b58` }
                          : { fontWeight: `500` }
                      }
                    >
                      Measurements
                    </span>
                  </li>
                </Tooltip>
              )}
            </AniLink>
          ) : (
            <></>
          )}
          {!isPatient ? (
            <AniLink
              fade
              to="/procedures"
              onClick={() => {
                this.setState({
                  activeLink: 'procedures',
                })
                this.props.setActiveLink('procedures')
              }}
            >
              {isVisible ? (
                <li
                  className="sidebar__link"
                  id="sidebar__link-procedures"
                  style={
                    this.props.activeLink == 'procedures'
                      ? {
                          backgroundColor: `#8db6d9`,
                          borderRight: `5px solid #3eb5c7`,
                        }
                      : {}
                  }
                >
                  <FaProcedures
                    className="sidebar__icon"
                    style={
                      this.props.activeLink == 'procedures'
                        ? { color: `#012b58` }
                        : { color: `#707070` }
                    }
                  />
                  <span
                    className="sidebar__link-name"
                    style={
                      this.props.activeLink == 'procedures'
                        ? { fontWeight: `bold`, color: `#012b58` }
                        : { fontWeight: `500` }
                    }
                  >
                    Procedures
                  </span>
                </li>
              ) : (
                <Tooltip title="Procedures" arrow placement="right">
                  <li
                    className="sidebar__link"
                    id="sidebar__link-procedures"
                    style={
                      this.props.activeLink == 'procedures'
                        ? {
                            backgroundColor: `#8db6d9`,
                            borderRight: `5px solid #3eb5c7`,
                          }
                        : {}
                    }
                  >
                    <FaProcedures
                      className="sidebar__icon"
                      style={
                        this.props.activeLink == 'procedures'
                          ? { color: `#012b58` }
                          : { color: `#707070` }
                      }
                    />
                    <span
                      className="sidebar__link-name"
                      style={
                        this.props.activeLink == 'procedures'
                          ? { fontWeight: `bold`, color: `#012b58` }
                          : { fontWeight: `500` }
                      }
                    >
                      Procedures
                    </span>
                  </li>
                </Tooltip>
              )}
            </AniLink>
          ) : (
            <></>
          )}
          <AniLink
            fade
            to="/customer-care"
            onClick={() => {
              this.setState({
                activeLink: 'customer-care',
              })
              this.props.setActiveLink('customer-care')
            }}
          >
            {isVisible ? (
              <li
                className="sidebar__link"
                id="sidebar__link-customer-care"
                style={
                  this.props.activeLink == 'customer-care'
                    ? {
                        backgroundColor: `#8db6d9`,
                        borderRight: `5px solid #3eb5c7`,
                        marginBottom: `150px`,
                      }
                    : { marginBottom: `150px` }
                }
              >
                <FaHeadset
                  className="sidebar__icon"
                  style={
                    this.props.activeLink == 'customer-care'
                      ? { color: `#012b58` }
                      : { color: `#707070` }
                  }
                />
                <span
                  className="sidebar__link-name"
                  style={
                    this.props.activeLink == 'customer-care'
                      ? { fontWeight: `bold`, color: `#012b58` }
                      : { fontWeight: `500` }
                  }
                >
                  Customer Care
                </span>
              </li>
            ) : (
              <Tooltip title="Customer Care" arrow placement="right">
                <li
                  className="sidebar__link"
                  id="sidebar__link-customer-care"
                  style={
                    this.props.activeLink == 'customer-care'
                      ? {
                          backgroundColor: `#8db6d9`,
                          borderRight: `5px solid #3eb5c7`,
                          marginBottom: `150px`,
                        }
                      : { marginBottom: `150px` }
                  }
                >
                  <FaHeadset
                    className="sidebar__icon"
                    style={
                      this.props.activeLink == 'customer-care'
                        ? { color: `#012b58` }
                        : { color: `#707070` }
                    }
                  />
                  <span
                    className="sidebar__link-name"
                    style={
                      this.props.activeLink == 'customer-care'
                        ? { fontWeight: `bold`, color: `#012b58` }
                        : { fontWeight: `500` }
                    }
                  >
                    Customer Care
                  </span>
                </li>
              </Tooltip>
            )}
          </AniLink>
          <li>
            <footer>
              <hr
                className="sidebar__hr"
                style={{ marginTop: `5px`, marginBottom: `5px` }}
              />
              <AniLink
                fade
                to="/logout"
                onClick={() => {
                  this.setState({
                    activeLink: 'home',
                  })
                  this.props.setActiveLink('home')
                }}
              >
                {isVisible ? (
                  <div className="sidebar__link">
                    <AiOutlinePoweroff className="sidebar__icon" />
                    <span className="sidebar__link-name">Log out</span>
                  </div>
                ) : (
                  <Tooltip title="Logout" arrow placement="right">
                    <div className="sidebar__link">
                      <AiOutlinePoweroff className="sidebar__icon" />
                      <span className="sidebar__link-name">Log out</span>
                    </div>
                  </Tooltip>
                )}
              </AniLink>
            </footer>
          </li>
        </ul>
      </Fragment>
    )
  }

  render() {
    return <Fragment>{this.getSidebar()}</Fragment>
  }
}

export default Sidenavbar
