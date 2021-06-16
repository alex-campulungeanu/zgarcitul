import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Badge, Box, Hidden, IconButton, Toolbar, makeStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { Input as InputIcon } from '@material-ui/icons';

import Logo from 'src/components/Logo';
import ConfirmModal from 'src/components/common/ConfirmModal'
import { logout } from 'src/reducers/authentication.reducer'

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  }
}));

const TopBar = ({className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const [ notifications ] = useState([]);
  const [ confirmOpen, setConfirmOpen ] = useState(false)

  const handleLogout = () => {
    rest.logout()
  }

  return (
    // <AppBar className={clsx(classes.root, className)} elevation={0} {...rest} >
    <AppBar className={clsx(classes.root, className)} elevation={0} >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden mdDown>
          {/* <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="primary" variant="dot" >
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <IconButton color="inherit" onClick = {() => setConfirmOpen(true)}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen} >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      <ConfirmModal 
        content='Are you sure you want to leeeave us ?'
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleLogout}
      />
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

// const mapStateToProps = ({}) => {
//   return {

//   }
// }

const mapDispatchToProps = { logout }

export default connect(null, mapDispatchToProps)(TopBar);
