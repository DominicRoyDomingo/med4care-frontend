{
  /*
   * mobiledrawer.js
   *
   * Navigation drawer for mobile devices
   *
   * Author: Dominic Domingo
   * Created: 02/06/2020
   *
   */
}

import React, { Fragment } from 'react'
import {
  makeStyles,
  Fab,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@material-ui/core'
import {
  FaInfoCircle,
  FaHeadset,
  FaRegQuestionCircle,
  FaRuler,
  FaProcedures,
} from 'react-icons/fa'
import {
  AiOutlinePoweroff,
  AiOutlineHistory,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai'
import { MdDashboard } from 'react-icons/md'
import { FiInbox, FiShield } from 'react-icons/fi'
import { GiConversation } from 'react-icons/gi'
import { getUserDetails } from '../../utils/auth'
import logo from '../../../images/logo.png'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      position: 'absolute',
      top: theme.spacing(0),
      left: theme.spacing(0),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  itemIcon: {
    minWidth: '35px',
    maxWidth: '35px',
  },
  subHeader: {
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Open Sans',
    fontSize: '12px',
  },
  fullList: {
    width: 'auto',
    fontSize: '13px',
    fontFamily: 'Open Sans',
  },
  fab: {
    backgroundColor: '#8DB6D9',
    border: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#8DB6D9',
    },
  },
  fabIcon: {
    width: '27px',
    height: '27px',
    color: '#012b58',
  },
}))

export default function MobileDrawer() {
  const classes = useStyles()
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [state, setState] = React.useState({
    left: false,
  })
  const [isPatient, setIsPatient] = React.useState(null)

  React.useEffect(() => {
    setIsPatient(getUserDetails('is_patient'))
  }, [])

  const toggleDrawer = (side, open) => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [side]: open })
  }

  const fullList = side => (
    <div
      className={classes.fullList}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <AniLink fade to="/home">
        <img src={logo} alt="logo" id="sidebar__logo" />
      </AniLink>
      <hr className="sidebar__hr" />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" className={classes.subHeader}>
            <MdDashboard className={classes.itemIcon} /> Dashboard
          </ListSubheader>
        }
      >
        <AniLink fade to="/mailbox">
          <ListItem button key="Mailbox">
            <ListItemIcon>
              <FiInbox className={classes.itemIcon} />
            </ListItemIcon>
            <ListItemText primary="Mailbox" />
          </ListItem>
        </AniLink>
        {!isPatient ? (
          <AniLink fade to="/ask-a-patient">
            <ListItem button key="Ask a Patient">
              <ListItemIcon>
                <FaRegQuestionCircle className={classes.itemIcon} />
              </ListItemIcon>
              <ListItemText primary="Ask a Patient" />
            </ListItem>
          </AniLink>
        ) : (
          <></>
        )}
      </List>
      <Divider />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" className={classes.subHeader}>
            <FaInfoCircle className={classes.itemIcon} /> Patient Information
          </ListSubheader>
        }
      >
        <AniLink fade to="/privacy-policy">
          <ListItem button key="Privacy Policy">
            <ListItemIcon>
              <FiShield className={classes.itemIcon} />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" />
          </ListItem>
        </AniLink>
        {isPatient ? (
          <AniLink fade to="/questionnaires">
            <ListItem button key="Questionnaires">
              <ListItemIcon>
                <GiConversation className={classes.itemIcon} />
              </ListItemIcon>
              <ListItemText primary="Questionnaires" />
            </ListItem>
          </AniLink>
        ) : (
          <></>
        )}
        <AniLink fade to="/question-history">
          <ListItem button key="Question History">
            <ListItemIcon>
              <AiOutlineHistory className={classes.itemIcon} />
            </ListItemIcon>
            <ListItemText primary="Question History" />
          </ListItem>
        </AniLink>
      </List>
      <Divider />
      <List>
        {!isPatient ? (
          <AniLink fade to="/measurements">
            <ListItem button key="Measurements">
              <ListItemIcon>
                <FaRuler className={classes.itemIcon} />
              </ListItemIcon>
              <ListItemText primary="Measurements" />
            </ListItem>
          </AniLink>
        ) : (
          <></>
        )}
        {!isPatient ? (
          <AniLink fade to="/procedures">
            <ListItem button key="Procedures">
              <ListItemIcon>
                <FaProcedures className={classes.itemIcon} />
              </ListItemIcon>
              <ListItemText primary="Procedures" />
            </ListItem>
          </AniLink>
        ) : (
          <></>
        )}
        <AniLink fade to="/customer-care">
          <ListItem button key="Customer Care">
            <ListItemIcon>
              <FaHeadset className={classes.itemIcon} />
            </ListItemIcon>
            <ListItemText primary="Customer Care" />
          </ListItem>
        </AniLink>
      </List>
      <Divider />
      <List>
        <AniLink fade to="/logout">
          <ListItem button key="Logout">
            <ListItemIcon>
              <AiOutlinePoweroff className={classes.itemIcon} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </AniLink>
      </List>
    </div>
  )

  return (
    <Fragment>
      <div className={classes.root}>
        <Fab
          color="primary"
          onClick={toggleDrawer('left', true)}
          className={clsx(classes.fab, 'mobile-drawer__fab-icon')}
        >
          {state.left ? (
            <AiOutlineMenuFold className={classes.fabIcon} />
          ) : (
            <AiOutlineMenuUnfold className={classes.fabIcon} />
          )}
        </Fab>
      </div>
      <div>
        <SwipeableDrawer
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          anchor="left"
          open={state.left}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {fullList('left')}
        </SwipeableDrawer>
      </div>
    </Fragment>
  )
}
