{
  /*
   * appbarheader.js
   *
   * Material UI AppBar as header
   *
   * Author: Dominic Domingo
   * Created: 2/07/2020
   *
   */
}

import React from 'react'
import {
  makeStyles,
  withStyles,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  TextField,
  Divider,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { MdSearch, MdEmail, MdNotifications, MdMoreVert } from 'react-icons/md'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { FiSettings, FiPlayCircle, FiPower } from 'react-icons/fi'
import { getUserDetails } from '../../utils/auth'
import { navigate } from 'gatsby'
import { useSnackbar } from 'notistack'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import clsx from 'clsx'

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge)

const NotificationBadge = withStyles(theme => ({
  badge: {
    right: -3,
    top: 5,
    padding: '0 1px',
    fontSize: '0.35em',
  },
}))(Badge)

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    background: `linear-gradient(to bottom, #8db6d9 0%, #8db6d9 100%)`,
    border: 0,
    boxShadow: '0px 12px 6px -9px rgba(0,0,0,0.3)',
    color: '#012b58',
    paddingTop: '1vh',
    height: 80,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    background: '#8db6d9',
    transition: 'all 0.3s ease',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    color: '#012b58',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(141, 182, 217, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(141, 182, 217, 0.25)',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  },
  searchIcon: {
    color: '#012b58',
    width: '20px',
    height: '20px',
    marginTop: '-2px',
    marginRight: '5px',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  accountName: {
    fontSize: '15px',
    marginLeft: theme.spacing(2),
    marginTop: `20px`,
    color: '#012b58',
    fontWeight: 'bold',
  },
  menuList: {
    fontSize: '15px',
  },
  menu: {
    marginTop: '50px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    color: '#012b58',
    backgroundColor: '#3EB5C7',
  },
  fallbackAvatar: {
    color: '#012b58',
    backgroundColor: '#3EB5C7',
  },
}))

export default function AppBarHeader(props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [visible, setVisible] = React.useState(true)
  const [userInfo, setUserInfo] = React.useState({ key: 'value' })

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      className={classes.menu}
    >
      <MenuItem onClick={handleMenuClose}>
        <Avatar
          alt={userInfo.name}
          src={userInfo.image}
          className={classes.small}
        />
        <strong style={{ marginLeft: `10px` }}>{userInfo.name}</strong>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <FiSettings className="account-settings__menu-item-icon" />
        Account Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <FiPlayCircle className="account-settings__menu-item-icon" />
        Inactive Walkthrough
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleMenuClose}>
        <FiPower className="account-settings__menu-item-icon" />
        <AniLink fade to="/logout">
          Log out
        </AniLink>
      </MenuItem>
    </Menu>
  )

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      className={classes.menu}
    >
      <MenuItem>
        <IconButton aria-label="new mails" color="inherit">
          <NotificationBadge color="error" badgeContent={0}>
            <MdEmail style={{ color: '#0B1A31' }} />
          </NotificationBadge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <Divider />
      <MenuItem>
        <IconButton aria-label="new notifications" color="inherit">
          <NotificationBadge color="error" badgeContent={0}>
            <MdNotifications style={{ color: '#0B1A31' }} />
          </NotificationBadge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <StyledBadge
            overlap="circle"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            variant="dot"
          >
            <Avatar
              alt={userInfo.name}
              src={userInfo.image}
              className={classes.fallbackAvatar}
            />
          </StyledBadge>
        </IconButton>
        <p>
          <strong>{userInfo.name}</strong>
        </p>
      </MenuItem>
    </Menu>
  )

  React.useEffect(() => {
    setUserInfo({
      name: getUserDetails('name'),
      firstName: getUserDetails('first_name'),
      image: getUserDetails('image'),
    })
  }, [])

  const navigationItems = getUserDetails('is_patient')
    ? [
        { masterLink: 'Dashboard', title: 'Mailbox', goto: '/mailbox' },
        {
          masterLink: 'Patient Information',
          title: 'Privacy Policy',
          goto: '/privacy-policy',
        },
        {
          masterLink: 'Patient Information',
          title: 'Questionnaires',
          goto: '/questionnaires',
        },
        {
          masterLink: 'Patient Information',
          title: 'Question History',
          goto: '/question-history',
        },
        {
          masterLink: 'Others',
          title: 'Customer Care',
          goto: '/customer-care',
        },
      ]
    : [
        { masterLink: 'Dashboard', title: 'Mailbox', goto: '/mailbox' },
        {
          masterLink: 'Dashboard',
          title: 'Ask a Patient',
          goto: '/ask-a-patient',
        },
        {
          masterLink: 'Patient Information',
          title: 'Privacy Policy',
          goto: '/privacy-policy',
        },
        {
          masterLink: 'Patient Information',
          title: 'Question History',
          goto: '/question-history',
        },
        { masterLink: 'Others', title: 'Measurements', goto: '/measurements' },
        { masterLink: 'Others', title: 'Procedures', goto: '/procedures' },
        {
          masterLink: 'Others',
          title: 'Customer Care',
          goto: '/customer-care',
        },
      ]

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Tooltip
            title={!visible ? 'Minimize' : 'Maximize'}
            arrow
            placement="right"
            enterDelay={500}
          >
            <IconButton
              edge="start"
              className={clsx('menu-icon', classes.menuButton)}
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setVisible(!visible)
                props.setVisible(visible)
              }}
            >
              {visible ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            </IconButton>
          </Tooltip>
          <Autocomplete
            id="header__search"
            options={navigationItems}
            getOptionLabel={option => option.title}
            style={{ width: 500, color: `#012b58` }}
            groupBy={option => option.masterLink}
            onChange={(event, value) => {
              value !== null
                ? navigate(value.goto)
                : enqueueSnackbar(
                    'Nothing happened because you are already here.',
                    { variant: 'info' }
                  )
            }}
            noOptionsText="That destination does not exists"
            className={classes.search}
            renderInput={params => (
              <TextField
                {...params}
                label={
                  <>
                    <MdSearch className={classes.searchIcon} />
                    <span style={{ color: `#012b58` }}>Search...</span>
                  </>
                }
                variant="filled"
                fullWidth
                style={{ color: `#fff` }}
              />
            )}
          />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              className={classes.headerIcon}
            >
              <NotificationBadge color="error" badgeContent={0}>
                <MdEmail />
              </NotificationBadge>
            </IconButton>
            <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              className={classes.headerIcon}
            >
              <NotificationBadge color="error" badgeContent={0}>
                <MdNotifications />
              </NotificationBadge>
            </IconButton>

            <span className={classes.accountName}>{userInfo.name}</span>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className={classes.headerIcon}
            >
              <StyledBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Avatar
                  alt={userInfo.name}
                  src={userInfo.image}
                  className={classes.fallbackAvatar}
                />
              </StyledBadge>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MdMoreVert />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  )
}
