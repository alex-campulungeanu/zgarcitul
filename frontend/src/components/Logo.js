import React from 'react';
import { Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({
  root: {},
}));

const Logo = (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.box}>
      <img
        style={{height: 50}}
        alt="Logo"
        src="/static/best-price-badge-xxl.png"
        {...props}
      />
    </Box>
  );
};

export default Logo;
